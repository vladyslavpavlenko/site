---
title: "The Lessons We Learned Rotating Apple Pay Certificates"
slug: "the-lessons-we-learned-rotating-apple-pay-certificates"
publishedDate: "2025-11-04T20:00:00.000+02:00"
coverLight: "/the-lessons-we-learned-rotating-apple-pay-certificates-cover-light.png"
coverDark: "/the-lessons-we-learned-rotating-apple-pay-certificates-cover-dark.png"
coverAlt: null
metaDescription: "In this article, I share how I managed to implement Apple Pay certificate rotation in a way that saved my company thousands of dollars in processing costs."
tags: ["Go", "Apple Pay", "Fintech"]
---

When talking to engineers who have had to deal with Apple certificates at least once in their careers, be especially cautious — this topic can trigger some serious flashbacks.

In this article I describe how I implemented Apple Pay certificate rotation in a way that saved my company thousands of dollars in processing costs, without losing a single transaction or experiencing any downtime.

# Introduction
Some time after I joined [Solidgate](https://solidgate.com), I was assigned as the DRI for Apple & Google Pay integrations. My initial task was to reengineer legacy Kotlin services and reimplement them in Go.

While this project alone provided abundant material to discuss, I discovered that our Apple Pay certificates were due to expire in a few months. I started delving deeper and raised the issue to make sure we had a safe, low-risk rotation plan.

Moreover, I discovered that the company lacked a proper rotation plan, which occasionally caused lengthy downtimes during certificate rotations and consequently led to processing losses for merchants. As a payment processor, such downtime causes losses for all our non-H2H merchants.

# Apple Pay Certificates: The Saga
There's a useful [article](https://tech.bolt.com/apple-pay-certificate-rotation-e4eee6b0683f) from Bolt that covers the different types of Apple certificates and strategies for rotating them. It was incredibly helpful — I highly recommend reading it.

At Solidgate we work with three types of Apple Pay certificates:

1. **Domain Verification Certificate** — before a merchant can display the Apple Pay button on their website, their domain must be linked to an Apple Merchant ID and verified by Apple. This verification involves uploading a merchant-specific file provided by Apple to a designated path on the merchant’s domain. In our setup, merchants complete this verification through our Hub, which then sends the verification request to Apple’s servers via the backend.
2. **Merchant Identity Certificate** — when a customer clicks the Apple Pay button, Solidgate sends a start_session request to Apple’s servers using an Apple Pay Merchant Identity certificate. This request must succeed for the Apple Pay checkout to proceed. The start_session flow verifies that a valid merchant domain is associated with the entity attempting to process the transaction. In short, this is the certificate used to establish a TLS connection from your HTTP client.
3. **Payment Processing Certificate** — after a customer initiates payment, Apple Pay encrypts the payment data using the public key associated with the certificate returned in the start_session response, then transmits the encrypted payload to Solidgate. We use our Payment Processing certificate to decrypt the data and extract the information necessary to perform an authorization request. Encrypting the payment data in this way protects its integrity in transit and ensures that only authorized entities can process the transaction.

It’s important to note that:
- Each Merchant ID can have **up to two** active Merchant Identity Certificates **at the same time**.
- Each Merchant ID can also have **up to two** Payment Processing Certificates, but **only one** Payment Processing Certificate may be active **at a time**.

However, we are primarily interested in the Merchant Identity Certificate and the Payment Processing Certificate, because they **expire two years after creation**.

# Apple Cryptography
To generate new certificates, you first need to create a Certificate Signing Request (CSR). While the [official documentation](https://developer.apple.com/help/account/certificates/create-a-certificate-signing-request/) recommends using OpenSSL, in our experience it has proven to be unreliable. After generating a certificate using a CSR created with OpenSSL, the resulting hashes often did not match, no matter how carefully I tried to replicate the algorithm. Unfortunately, the documentation leaves much of this process unclear.

In short, the most reliable way to create a CSR is by using Apple's **Keychain Access**. It is also important to note that CSRs must be generated using the **Apple Worldwide Developer Relations Certificate Authority**.

A few key points about CSRs:
- **Payment Processing Certificates** use a **Prime256v1** CSR (256 bits, ECC algorithm).
- **Merchant Identity Certificates** use an **RSA (2048)** CSR (2048 bits, RSA algorithm).
- In most cases, you’ll want your private keys to follow the [**PKCS#8**](https://stackoverflow.com/questions/75351338/pkcs1-vs-pkcs8-vs-pkcs12-for-rsa-keys) syntax. The keys are generated together with the CSRs.

# Rotation
The complication in our case was that we had to rotate certificates across multiple services — namely our payment-interface backends and the decryption service. Good old microservice architecture never fails to add extra work!

For the payment services, the only certificate required is the Merchant Identity Certificate: it’s used to configure TLS for the Apple HTTP client so we can initialize payment sessions. The decryption service, additionally, uses the Payment Processing Certificate to decrypt payloads and extract the information needed to process merchants' payments.

## Merchant Identity Certificate
As mentioned earlier, this certificate is crucial for the payment process to even begin, so we start with it. The main goal of the rotation is to switch to the new certificate seamlessly, without losing any requests in production.

In Go, the TLS configuration is initialized within the `http.Client`. Therefore, the most straightforward approach would be to use two clients.

```go
roots := x509.NewCertPool()
roots.AppendCertsFromPEM(caPEM)

client := &http.Client{
	Transport: &http.Transport{
		TLSClientConfig: &tls.Config{
			RootCAs: roots,
		},
	},
}
```

However, I didn’t like this idea and wanted a more sophisticated solution. This led me to the concept of a **dynamic TLS configuration** – essentially, an `http.RoundTripper` that adds automatic TLS certificate failover to the `http.Client`. On top of that, I implemented a kind-of circuit breaker so that both certificates are always attempted. In case of repeated failures, the configuration automatically switches in favor of the failover certificate (and vice versa).

```go
// RoundTrip implements http.RoundTripper.
// It tries the primary certificate first, then secondary if primary fails.
// After threshold consecutive failures, it tries secondary first.
func (t *Transport) RoundTrip(req *http.Request) (*http.Response, error) {
	trySecondaryFirst := t.pFailures.Load() >= t.threshold

	if trySecondaryFirst {
		// Try secondary first
		resp, err := t.do(req, t.sLoader)
		if err == nil {
			return resp, nil
		}

		// SecondaryLoader failed, try primary
		resp, err = t.do(req, t.pLoader)
		if err == nil {
			// PrimaryLoader succeeded, reset failure counter
			t.pFailures.Store(0)
			return resp, nil
		}

		return nil, err
	}

	// Try primary first
	resp, err := t.do(req, t.pLoader)
	if err == nil {
		t.pFailures.Store(0)
		return resp, nil
	}

	// PrimaryLoader failed
	t.pFailures.Add(1)

	// Try secondary
	resp, err = t.do(req, t.sLoader)
	if err == nil {
		return resp, nil
	}

	return nil, err
}
```

Here's how my [dynamictls](github.com/vladyslavpavlenko/dynamictls) package can be used:

```go
import (
	"crypto/tls"
	"net/http"
		
	"github.com/vladyslavpavlenko/dynamictls"
)

// Define certificate loaders
primary := func() (*tls.Certificate, error) {
	cert, err := tls.LoadX509KeyPair("primary.crt", "primary.key")
	return &cert, err
}

secondary := func() (*tls.Certificate, error) {
	cert, err := tls.LoadX509KeyPair("secondary.crt", "secondary.key")
	return &cert, err
}

// Use with HTTP client
client := &http.Client{
	Transport: dynamictls.New(dynamictls.Config{
		PrimaryLoader:   primary,
		SecondaryLoader: secondary,
		BaseTLS: &tls.Config{
		MinVersion: tls.VersionTLS12,
	},
	Threshold: 3,
	}),
}

resp, err := client.Get("https://example.com")
```

If you noticed a potential place for improvement – feel free to contribute.

## Payment Processing Certificate

## The Rotation Day
With all the systems prepared, we scheduled the rotation for early in the morning, when the Apple Pay traffic was the smallest.

# Takeways
When it comes to what I learned from this journey, I would like to highlight these points:

- Always validate hashes to be 100% sure your certificates are properly generated.
- Your old Payment Processing Certificate will disappear the second you activated the new one.
- Make sure to add metrics to track the switching process. This will save you from uncertanity.

Hope my insights were helpful! 