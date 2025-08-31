import { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { posts, siteSettings } from "../../constants";

const Feed: FC = () => null;

export async function getServerSideProps({ res }) {
  const { json } = generateFeeds(posts, siteSettings);

  if (res) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate=604800"
    );
    res.write(json);
    res.end();
  }

  return {
    props: {},
  };
}

export default Feed;
