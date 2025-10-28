import Intro from "../components/Home/Intro";
import Resume from "../components/Home/Resume";
import { Main } from "../components/Layouts/Layouts";
import { SEO } from "../components/SEO/SEO";
import Library from "../components/Home/Library";
import Posts from "../components/Home/Posts";
import { siteSettings } from "../constants";
import { getPostMetadata } from "../lib/markdownLoader";

export default function HomePage({ posts = [] }) {
  const data = {
    siteSettings: {
      siteTitle: siteSettings.siteTitle,
      siteDescription: siteSettings.siteDescription
    },
    posts: [
      ...(posts || []).slice(0, 3).map(({ title, slug, publishedDate, metaDescription, tags }) => ({
        title,
        description: metaDescription,
        tags: tags || [],
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

export async function getStaticProps() {
  try {
    const posts = getPostMetadata(); // Only published posts by default

    return {
      props: {
        posts: posts || [],
      },
    };
  } catch (error) {
    console.error('Error loading posts in getStaticProps:', error);
    
    return {
      props: {
        posts: [],
      },
    };
  }
}