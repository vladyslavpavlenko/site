import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { Main } from "../../components/Layouts";
import { baseUrl, SEO } from "../../components/SEO";
import Badge from "../../components/Badge";
import { LinkShare } from "../../components/Links";
import { mdxComponents } from "../../components/Prose";
import formatDate from "../../lib/formatDate";
import contentfulLoader from "../../lib/contentfulLoader";
import { posts, siteSettings } from "../../constants";




export default function Post(props) {
  const router = useRouter();
  const slug = router.query.slug as string;

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <>
        <SEO
          seo={{
            title: "Not found",
          }}
        />
        <Main>
          <h1>Not found</h1>
        </Main>
      </>
    );
  }

  const { title, metaDescription, publishedDate, coverUrl, coverAlt } = post;
  const relativeUrl = `/posts/${slug}`;
  const url = `${baseUrl}${relativeUrl}`;

  return (
    <>
      <SEO
        seo={{
          title,
          description: metaDescription,
          path: relativeUrl,
          image: `${baseUrl}/api/og?title=${encodeURIComponent(title)}${
            coverUrl
              ? `&bg=${encodeURI(
                  new URL(coverUrl).pathname.split("/").slice(2).join("/"),
                )}`
              : ""
          }`,
        }}
      />
      <Main>
        <header className="mb-6 rounded-lg sm:mb-6">
          <h1 className="pb-2 text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:pb-3 sm:text-3xl">
            <Link href={relativeUrl}>{title}</Link>
          </h1>
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-row items-center gap-2">
              <Link
                href="/"
                className="flex flex-row items-center gap-2 [font-variation-settings:'wght'_450]"
              >
                <div className="relative w-5 h-5">
                  <Image
                  alt={props.siteSettings.siteTitle}
                  title={props.siteSettings.siteTitle}
                  className="rounded-full bg-gray-200 dark:bg-neutral-600 object-cover"
                  src={props.siteSettings.avatarUrl}
                  fill
                  />
                </div>
              </Link>
              <time dateTime={publishedDate}>
                <Badge>{formatDate(publishedDate)}</Badge>
              </time>
            </div>
            <LinkShare title={title} url={url}>
              Share
            </LinkShare>
          </div>
        </header>

        <div className="rounded-lg p-0 sm:bg-gray-100 sm:p-20 sm:dark:bg-white/[.06]">
          {coverUrl ? (
            <Image
              height={400}
              width={700}
              alt={coverAlt || `Cover image for post: ${title}`}
              src={coverUrl}
              loader={(props) =>
                contentfulLoader({
                  ...props,
                  custom: ["fit=crop", "f=center"],
                })
              }
              className="bg-gray-200 dark:bg-zinc-900 dark:opacity-100 rounded-lg sm:rounded-t-lg sm:rounded-b-none object-cover mb-4 sm:mb-14 h-40 sm:h-80 sm:-ml-20 sm:-mt-20 w-full sm:w-[calc(100%+5rem*2)] max-w-none"
            />
          ) : null}
          <div className="prose-custom prose-quotefix">
            <MDXRemote {...props.post.body} components={mdxComponents} />
          </div>
        </div>
      </Main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = posts.find(p => p.slug === params.slug);
  const remarkTypograf = require("@mavrin/remark-typograf");

  const body = await serialize(post.body, {
    mdxOptions: {
      remarkPlugins: [[remarkTypograf, { locale: ["en-US"] }]],
    },
  });

  return {
    props: {
      siteSettings,
      post: { ...post, body },
    },
  };
}
