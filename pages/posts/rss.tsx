import React, { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { siteSettings } from "../../constants";
import { getPostMetadata } from "../../lib/markdownLoader";
import Head from "next/head";

const RSS: FC<{ rss: string }> = ({ rss }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Content-Type" content="text/xml; charset=utf-8" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: rss }} style={{ display: 'none' }} />
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{rss}</pre>
    </>
  );
};

export async function getStaticProps() {
  try {
    const posts = getPostMetadata() || [];
    const { rss } = generateFeeds(posts, siteSettings);

    return {
      props: {
        rss,
      },
    };
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return {
      props: {
        rss: '',
      },
    };
  }
}

export default RSS;
