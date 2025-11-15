export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  url: string;
}

export const books: Book[] = [
  {
    title: "Fundamentals of Software Architecture",
    author: "Mark Richards, Neal Ford",
    coverUrl: "https://www.oreilly.com/covers/urn:orm:book:9781492043447/400w/",
    url: "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/"
  },
  {
    title: "Observability Engineering",
    author: "Charity Majors, Liz Fong-Jones, George Miranda",
    coverUrl: "https://www.oreilly.com/covers/urn:orm:book:9781492076438/400w/",
    url: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/"
  },
  {
    title: "Prometheus: Up & Running",
    author: "Julien Pivotto, Brian Brazil",
    coverUrl: "https://www.oreilly.com/covers/urn:orm:book:9781492034131/400w/",
    url: "https://www.oreilly.com/library/view/prometheus-up/9781492034131/"
  },
  {
    title: "The Art of Doing Science and Engineering",
    author: "Richard W. Hamming",
    coverUrl: "https://m.media-amazon.com/images/I/41hZEEzw30L._SL1480_.jpg",
    url: "https://www.amazon.com/Art-Doing-Science-Engineering-Learning/dp/1732265178"
  },
];

