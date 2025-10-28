import { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { siteSettings } from "../../constants";
import { getPostMetadata } from "../../lib/markdownLoader";

const RSS: FC = () => null;

export async function getServerSideProps({ res }) {
  try {
    const posts = getPostMetadata() || []; // Only published posts by default
    const { rss } = generateFeeds(posts, siteSettings);

    if (res) {
      res.setHeader("Content-Type", "text/xml");
      res.setHeader(
        "Cache-Control",
        "s-maxage=86400, stale-while-revalidate=604800"
      );
      res.write(rss);
      res.end();
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    if (res) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }

    return {
      props: {},
    };
  }
}

export default RSS;
