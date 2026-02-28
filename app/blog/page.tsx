import type { Metadata } from "next";
import { getLocaleCookie } from "@/app/actions/locale";
import { getAllPosts } from "@/lib/posts";
import blogData from "@/lib/pageData/blog";
import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "Blog | Dan Garcia",
  description: "Café com leitura – tecnologia e assuntos diversos",
};

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
