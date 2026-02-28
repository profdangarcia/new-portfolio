import PostItem from "./PostItem";
import type { PostMeta } from "@/types/post";

interface BlogGridProps {
  title: string;
  description: string;
  posts: PostMeta[];
}

export default function BlogGrid({ title, description, posts }: BlogGridProps) {
  return (
    <section className="bg-[var(--background)] py-4">
      <div className="container-portfolio">
        <div className="mt-5 text-right">
          <h1 className="font-bold text-[var(--text-title)] text-[1.625rem] md:text-[2.25rem]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {title}
          </h1>
          <h3 className="mt-4 text-[var(--text)] text-[1rem] md:text-[1.125rem]">
            {description}
          </h3>
        </div>
        <div
          className="grid min-h-[75vh] grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))] gap-5 py-4"
        >
          {posts.map((post) => (
            <PostItem key={post.slug} data={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
