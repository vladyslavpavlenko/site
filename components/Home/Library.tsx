// components/Home/Library.tsx

import MediaCard, { MediaCardImageRadius } from "../MediaCard";

export default function Library() {
  const books = [
    {
      title: "Fundamentals of Software Architecture",
      author: "Mark Richards, Neal Ford",
      coverUrl: "https://www.oreilly.com/covers/urn:orm:book:9781492043447/400w/",
      url: "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/"
    },
  ];

  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Library</h3>
      </dt>

      <dd className="list-content grid gap-4 sm:gap-6">
        {books.map((book, index) => (
          <div key={index} className="w-full">
            <MediaCard
              title={book.title}
              subtitle={book.author}
              image={{
                alt: `${book.title} by ${book.author}`,
                title: `${book.title} by ${book.author}`,
                src: book.coverUrl,
                width: 56,
                height: 80,
                radius: MediaCardImageRadius.Book,
              }}
              href={book.url}
              hrefLabel={book.url}
            />
          </div>
        ))}
      </dd>
    </dl>
  );
}
