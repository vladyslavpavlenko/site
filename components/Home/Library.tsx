// components/Home/Library.tsx

import Link from "next/link";
import MediaCard, { MediaCardImageRadius } from "../MediaCard/MediaCard";
import { books } from "../../lib/books";

export default function Library() {
  // Show only first 3 books on home page
  const displayedBooks = books.slice(0, 3);

  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Library</h3>
      </dt>

      <dd className="list-content grid gap-4 sm:gap-6">
        {displayedBooks.map((book, index) => (
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
        <div className="mt-2">
          <Link href="/library" className="link link-sm inline-flex items-center">
            View all
          </Link>
        </div>
      </dd>
    </dl>
  );
}
