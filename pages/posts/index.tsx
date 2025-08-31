import type { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { Main } from "../../components/Layouts";
import { SEO } from "../../components/SEO";
import formatDate from "../../lib/formatDate";
import { posts } from "../../constants";

export default function Posts({  }) {


  return (
    <>
      <SEO
        seo={{
          title: "Posts",
          path: "/posts",
        }}
      />
      <Main>
        <dl className="list-container items-center gap-2">
          {posts.map(({ slug, title, publishedDate }) => (
            <React.Fragment key={slug}>
              <dt className="list-title border-none pt-0">
                <time className="time time-lg" dateTime={publishedDate}>
                  {formatDate(publishedDate, true)}
                </time>
              </dt>
              <dd className="list-content border-none pb-4 pt-0 sm:pb-0">
                <div>
                  <Link href={`/posts/${slug}`} className="link">
                    {title}
                  </Link>
                </div>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </Main>
    </>
  );
}
