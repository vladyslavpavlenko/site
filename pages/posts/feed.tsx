import React, { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { siteSettings } from "../../constants";
import { getPostMetadata } from "../../lib/markdownLoader";
import Head from "next/head";

const Feed: FC<{ json: string }> = ({ json }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Content-Type" content="application/json; charset=utf-8" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: json }} style={{ display: 'none' }} />
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{json}</pre>
    </>
  );
};

export async function getStaticProps() {
  try {
    const posts = getPostMetadata() || [];
    const { json } = generateFeeds(posts, siteSettings);

    return {
      props: {
        json,
      },
    };
  } catch (error) {
    console.error('Error generating JSON feed:', error);
    return {
      props: {
        json: '',
      },
    };
  }
}

export default Feed;
