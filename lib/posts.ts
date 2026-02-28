import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { CompletePost } from "@/types/post";

const POSTS_DIR = join(process.cwd(), "content", "posts");

export async function getAllPosts(): Promise<CompletePost[]> {
  const filenames = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts: CompletePost[] = [];

  for (const filename of filenames) {
    const fullPath = join(POSTS_DIR, filename);
    const raw = readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const slug = filename.replace(/\.md$/, "");

    posts.push({
      id: data.id,
      slug,
      title: data.title,
      description: data.description,
      image: data.image ?? "",
      author: data.author ?? "",
      date: data.date ?? "",
    });
  }

  return posts.sort((a, b) => b.id - a.id);
}

export async function getPostBySlug(slug: string): Promise<CompletePost | null> {
  try {
    const fullPath = join(POSTS_DIR, `${slug}.md`);
    const raw = readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const html = marked.parse(content) as string;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image ?? "",
      author: data.author ?? "",
      date: data.date ?? "",
      slug,
      content: html,
    };
  } catch {
    return null;
  }
}
