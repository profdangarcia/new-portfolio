import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import blogData from "@/lib/pageData/blog";
import BlogGrid from "@/components/blog/BlogGrid";

export async function generateMetadata(): Promise<Metadata> {
  const data = blogData.en.seo;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dangarcia-devel.vercel.app";
  const canonical = "/en/blog";

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: baseUrl + canonical,
    },
    twitter: {
      title: data.title,
      description: data.description,
    },
    alternates: { canonical: baseUrl + canonical },
  };
}

export default async function BlogPageEn() {
  const posts = await getAllPosts("en");
  const { title, description } = blogData.en.blog;

  return (
    <BlogGrid
      title={title}
      description={description}
      posts={posts}
      basePath="/en/blog"
    />
  );
}

