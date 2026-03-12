import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dangarcia-devel.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ptPosts = await getAllPosts("pt");
  const enPosts = await getAllPosts("en");

  const ptPostUrls: MetadataRoute.Sitemap = ptPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const enPostUrls: MetadataRoute.Sitemap = enPosts.map((post) => ({
    url: `${baseUrl}/en/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...ptPostUrls,
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...enPostUrls,
  ];
}
