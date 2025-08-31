import { FC } from "react";
import generateFeeds from "../../lib/generateFeeds";
import { posts, siteSettings } from "../../constants";

const Atom: FC = () => null;

export async function getServerSideProps({ res }) {
  const { atom } = generateFeeds(posts, siteSettings);

  if (res) {
    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate=604800"
    );
    res.write(atom);
    res.end();
  }

  return {
    props: {},
  };
}

export default Atom;
