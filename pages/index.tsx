import Intro from "../components/Home/Intro";
import Resume from "../components/Home/Resume";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import Library from "../components/Home/Library";
import Posts from "../components/Home/Posts";
import SummaryCard from "../components/SummaryCard";
import { posts } from "../constants";
import { siteSettings } from "../constants";

export default function HomePage() {
  const data = {
    siteSettings: {
      siteTitle: siteSettings.siteTitle,
      siteDescription: siteSettings.siteDescription
    },
        posts: [
      ...posts.slice(0, 3).map(({ title, slug, publishedDate, metaDescription, tags }) => ({
        title,
        description: metaDescription,
        tags: tags,
        date: publishedDate,
        slug,
      }))
    ]
  };

  return (
    <>
      <SEO
        seo={{
          title: data.siteSettings.siteTitle,
          description: data.siteSettings.siteDescription,
          path: "/",
        }}
      />
      <Main>
        <Intro />
        <Resume />
        <Posts posts={data.posts} />
        <Library />
      </Main>
    </>
  );
}