import PostItem from "./PostItem";
import type { PostMeta } from "@/types/post";

interface BlogGridProps {
  title: string;
  description: string;
  posts: PostMeta[];
  basePath?: string;
}

export default function BlogGrid({ title, description, posts, basePath = "/blog" }: BlogGridProps) {
  const [first, ...rest] = posts;

  return (
    <section className="bg-[var(--background)] py-8">
      <div className="container-portfolio">
        <div className="mb-10 text-center md:text-left">
          <h1
            className="font-bold text-[var(--text-title)] text-2xl md:text-3xl"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {title}
          </h1>
          <p className="mt-4 text-[var(--text)] text-base md:text-lg">
            {description}
          </p>
        </div>
        <div className="grid min-h-[75vh] grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
          {first && (
            <PostItem key={first.slug} data={first} basePath={basePath} featured />
          )}
          {rest.map((post) => (
            <PostItem key={post.slug} data={post} basePath={basePath} />
          ))}
        </div>
      </div>
    </section>
  );
}
