export const intro = `Hello! My name is Vladyslav – I'm a Go engineer and Computer Science student at [KNU](https://knu.ua/en) in Kyiv, Ukraine.

Currently working at [Solidgate](https://solidgate.com), a fintech company providing a unified payment processing platform for international businesses.

I'm always eager to connect on tech and engineering topics. Reach out via [email](mailto:dan@x70.one) or [LinkedIn](https://linkedin.com/in/vladyslavpavlenko).`;

export const posts = [
  {
    title: "Markdown Test Post",
    slug: "markdown-test",
    publishedDate: "2025-08-31T20:00:00.000+03:00",
    coverUrl: null,
    coverAlt: null,
    metaDescription: "A comprehensive test of markdown formatting and components.",
    tags: ["Markdown"],
    body: `Here's some **bold text** and *italic text*. You can also combine them with ***bold and italic***. 

![A full date picker, including a popover calendar](//images.ctfassets.net/zgqdqhjfxb5o/sNNqRxG0VOJQqU16Kt6Uv/f65913669705ba1aabdcd417b7025708/full.png)\n\n

## This is an H3 Header
### This is an H4 Header

Here's some **bold text** and *italic text*. You can also combine them with ***bold and italic***.

Here's some \`inline code\` and a [link to Google](https://google.com).

## Code Blocks

Here's a Go code example:

\`\`\`go title="main.go"
package main

import "fmt"

func main() {
    // This is a comment
    name := "World"
    fmt.Printf("Hello, %s!\\n", name)
    
    // Array example
    numbers := []int{1, 2, 3, 4, 5}
    for i, num := range numbers {
        fmt.Printf("Index %d: %d\\n", i, num)
    }
}
\`\`\`

And here's a JavaScript example:

\`\`\`js title="Example Script"
console.log('Hello from JavaScript!');

const greet = (name) => {
    return \`Hello, \${name}!\`;
};

console.log(greet('World'));
\`\`\`

## Lists

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered List
1. First numbered item
2. Second numbered item
   1. Nested numbered item
   2. Another nested numbered item
3. Third numbered item

## Code Blocks

Here's a JavaScript code block:

And here's a Go code block:

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
\`\`\`
`
  },
];

export const siteSettings = {
  siteTitle: "Vladyslav Pavlenko",
  siteDescription: "This is Vlaydlsav Pavlenko's Blog Website",
  siteUrl: "https://vpavlenko.com",
  avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQGCzBhZj6558g/profile-displayphoto-scale_400_400/B56ZhRf33THkAg-/0/1753713968049?e=1758758400&v=beta&t=B-KPV2sR_-8LdzwTioAvCgn5XrzCbyW1G_mMoWDVB7E"
};
