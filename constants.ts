export const intro = `Hello! My name is Vladyslav – I'm a Go engineer and Computer Science student at [KNU](https://knu.ua/en) in Kyiv, Ukraine.

Currently working at [Solidgate](https://solidgate.com), a fintech company providing a unified payment processing platform for international businesses.

I'm always eager to connect on tech and engineering topics. Reach out via [email](mailto:dan@x70.one) or [LinkedIn](https://linkedin.com/in/vladyslavpavlenko).`;

export const posts = [
  {
    title: "How to Become a Junior Dev Everyone Wants to Hire",
    slug: "the-art-of-scoping",
    publishedDate: "2025-04-30T00:00:00.000+01:00",
    coverUrl: null,
    coverAlt: null,
    metaDescription: "Scoping software is difficult. In this quick post, I'm outlining an example of scoping done right.",
    tags: ["Career"],
    body: "<Note>\n  I wrote this post about 5 years ago. I wanted to include it as I still very much stand by it. Living by principle and all that.\n</Note>\n\nScoping software is difficult. Commit too much, and you're wasting time that you could've spent learning from your users. Commit too little and watch nobody adopt your incomplete feature. It's a balancing act -- the difference between an MVP (Minimum Viable Product) and SLC (Simple, Lovable, and Complete).\n\nWhen looking for examples of what makes a great MVP, you usually read about companies that aim to achieve product-market fit. Maybe early Airbnb or Uber. But how does this apply when building features and capabilities for an existing service that's well beyond that point?\n\n---\n\nI recently observed a great example of this kind of scoping done right. A couple months ago, Stripe released [Stripe Apps](//stripe.com/apps). Apps allow developers to extend the UI of the Stripe Dashboard with additional functionality and views.\n\nFrom what I could tell while browsing Twitter, Stripe only took a couple months to launch the first version of Apps. Scoping a complex project like this down to a well-rounded product must've been challenging. Not just in the broad strokes, but I'm sure it required making tough decisions on lots of details along the way.\n\nYet one of those decisions in particular caught my eye. To enable developers to build apps, Stripe had to build an entire [component library](//stripe.com/docs/stripe-apps/components) to support common use cases -- on top of the core functionality. One of the components developers would likely need to build a Stripe app is a date picker, to filter payment-related information by a date range. If you've ever designed or built a date picker, you know what a time-consuming task that can be. Safe to say, it would take a long time to get it right.\n\n![A full date picker, including a popover calendar](//images.ctfassets.net/zgqdqhjfxb5o/sNNqRxG0VOJQqU16Kt6Uv/f65913669705ba1aabdcd417b7025708/full.png)\n\nSo what did they do? Instead of scoping it out of the first release, or building a full-featured date picker with a popover calendar and everything, they launched with a [masked input field](//stripe.com/docs/stripe-apps/components/datefield) for dates. This enabled their users to effectively solve one of the most common use cases when building an app from the beginning. They were able to release it in a short amount of time on par with their quality standards. On top, they kept the option of iterating on it in the future, without breaking any existing behavior.\n\n![A simple masked input field for dates](//images.ctfassets.net/zgqdqhjfxb5o/71W2A07oSJ058JDrFcNagm/bae8436e9b606871ee5f3b5f238a1e0b/scoped.png)\n\nThis low-level, almost invisible decision may seem trivial, but it's one of the hundreds of decisions you have to make when scoping and building software. Finding that sweet spot of not too much, not too little, to get it out on time and in the right quality is the art of scoping."
  },
];

export const siteSettings = {
  siteTitle: "Vlaydlsav Pavlenko",
  siteDescription: "This is Vlaydlsav Pavlenko's Blog Website",
  siteUrl: "https://vpavlenko.com",
  avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQGCzBhZj6558g/profile-displayphoto-scale_400_400/B56ZhRf33THkAg-/0/1753713968049?e=1758758400&v=beta&t=B-KPV2sR_-8LdzwTioAvCgn5XrzCbyW1G_mMoWDVB7E"
};
