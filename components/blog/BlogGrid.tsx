import PostItem from "./PostItem";
import type { PostMeta } from "@/types/post";

interface BlogGridProps {
  title: string;
  description: string;
  posts: PostMeta[];
}

export default function BlogGrid({ title, description, posts }: BlogGridProps) {
  return (
    <section className="bg-[#f5f5f5] py-4">
      <div className="container-portfolio">
        <div className="mt-5 text-right">
          <h1
            className="font-bold text-[#333] text-[1.625rem] md:text-[2.25rem]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {title}
          </h1>
          <h3 className="mt-[0.9375rem] text-right text-[#777] text-[1rem] md:text-[1.125rem]">
            {description}
          </h3>
        </div>
        <div
          className="grid min-h-[75vh] grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))] gap-5 py-[0.9375rem]"
          style={{ gridAutoRows: "minmax(min-content, max-content)" }}
        >
          {posts.map((post) => (
            <PostItem key={post.slug} data={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
