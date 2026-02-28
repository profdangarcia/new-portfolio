import type { Metadata } from "next";
import { getLocaleCookie } from "@/app/actions/locale";
import { getAllPosts } from "@/lib/posts";
import blogData from "@/lib/pageData/blog";
import BlogGrid from "@/components/BlogGrid";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleCookie();
  const data = blogData[locale].seo;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dangarcia-devel.vercel.app";
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: baseUrl + (data.canonical ?? "/blog"),
    },
    twitter: {
      title: data.title,
      description: data.description,
    },
    alternates: { canonical: baseUrl + (data.canonical ?? "/blog") },
  };
}

export default async function BlogPage() {
  const locale = await getLocaleCookie();
  const posts = await getAllPosts();
  const { title, description } = blogData[locale].blog;

  return (
    <BlogGrid
      title={title}
      description={description}
      posts={posts}
    />
  );
}
