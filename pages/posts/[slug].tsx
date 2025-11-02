import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrism from "@mapbox/rehype-prism";
import rehypeCodeTitles from "rehype-code-titles";
import { Main } from "../../components/Layouts/Layouts";
import { baseUrl, SEO } from "../../components/SEO/SEO";
import Badge from "../../components/Badge/Badge";
import { LinkShare } from "../../components/Links/Links";
import { mdxComponents } from "../../components/Prose/Prose";
import formatDate from "../../lib/formatDate";
import contentfulLoader from "../../lib/contentfulLoader";
import { getPostBySlug, getPostSlugs } from "../../lib/markdownLoader";
import { siteSettings } from "../../constants";

export default function Post(props) {
  const router = useRouter();
  const slug = router.query.slug as string;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const avatarPath = `${basePath}/pic.png`;

  const post = props.post;

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
          {post.draft && (
            <div className="mb-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-3">
              <div className="flex items-center">
                <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                  📝 Draft Post - This post is not published and only visible in development mode
                </span>
              </div>
            </div>
          )}
          <h1 className="pb-2 text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_600] dark:text-white sm:pb-3 sm:text-3xl font-bold">
            <Link href={relativeUrl}>{title}</Link>
          </h1>
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="flex flex-row items-center gap-2 [font-variation-settings:'wght'_450]"
              >
                <div className="relative w-5 h-5">
                  <Image
                    alt={props.siteSettings?.siteTitle || "Site avatar"}
                    title={props.siteSettings?.siteTitle || "Site avatar"}
                    className="rounded-full bg-gray-200 dark:bg-neutral-600 object-cover"
                    src={avatarPath}
                    fill
                    unoptimized
                  />
                </div>
                <span className="text-neutral-800 dark:text-silver">Vladyslav Pavlenko</span>
              </Link>
              <time dateTime={publishedDate} className="ml-0 text-sm text-neutral-500 dark:text-silver-dark">
                {formatDate(publishedDate)}
              </time>
            </div>
            <LinkShare title={title} url={url}>
              Share
            </LinkShare>
          </div>
        </header>

        <div className="rounded-lg p-0 pt-2">
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
  const slugs = getPostSlugs();
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  // In production, hide draft posts unless in development mode
  if (post.draft && process.env.NODE_ENV === 'production') {
    return {
      notFound: true,
    };
  }

  const remarkTypograf = require("@mavrin/remark-typograf");

  const body = await serialize(post.body, {
    mdxOptions: {
      remarkPlugins: [[remarkTypograf, { locale: ["en-US"] }]],
      rehypePlugins: [rehypeCodeTitles, rehypePrism],
    },
  });

  return {
    props: {
      siteSettings,
      post: { ...post, body },
    },
  };
}
