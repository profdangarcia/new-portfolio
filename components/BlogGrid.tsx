import SectionTitle from "./SectionTitle";
import PostItem from "./PostItem";
import type { PostMeta } from "@/types/post";

interface BlogGridProps {
  title: string;
  description: string;
  posts: PostMeta[];
}

export default function BlogGrid({ title, description, posts }: BlogGridProps) {
  return (
    <section className="bg-[var(--background)] py-16 md:py-24">
      <div className="container-portfolio">
        <SectionTitle title={title} description={description} />
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <PostItem key={post.slug} data={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
