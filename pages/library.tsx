import { Main } from "../components/Layouts/Layouts";
import { SEO } from "../components/SEO/SEO";
import MediaCard, { MediaCardImageRadius } from "../components/MediaCard/MediaCard";
import { books } from "../lib/books";

export default function Library() {
  return (
    <>
      <SEO
        seo={{
          title: "Library",
          path: "/library",
        }}
      />
      <Main>
        <div className="flex flex-col gap-4 sm:gap-6">
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
        </div>
      </Main>
    </>
  );
}

