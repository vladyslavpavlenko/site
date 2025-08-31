import { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { posts, siteSettings } from "../../constants";

const RSS: FC = () => null;

export async function getServerSideProps({ res }) {
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
}

export default RSS;
