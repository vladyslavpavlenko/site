import React, { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { siteSettings } from "../../constants";
import { getPostMetadata } from "../../lib/markdownLoader";
import Head from "next/head";

const Atom: FC<{ atom: string }> = ({ atom }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Content-Type" content="text/xml; charset=utf-8" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: atom }} style={{ display: 'none' }} />
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{atom}</pre>
    </>
  );
};

export async function getStaticProps() {
  try {
    const posts = getPostMetadata() || [];
    const { atom } = generateFeeds(posts, siteSettings);

    return {
      props: {
        atom,
      },
    };
  } catch (error) {
    console.error('Error generating atom feed:', error);
    return {
      props: {
        atom: '',
      },
    };
  }
}

export default Atom;
