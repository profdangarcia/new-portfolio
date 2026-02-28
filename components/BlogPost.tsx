import Image from "next/image";
import type { CompletePost } from "@/types/post";
import { Comments } from "./Comments";

interface BlogPostProps {
  data: CompletePost;
}

export default function BlogPost({ data }: BlogPostProps) {
  const { title, image, content, author, date } = data;

  return (
    <article className="bg-[var(--background)] py-16 md:py-24">
      <div className="container-portfolio">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-wide text-[var(--text-title)] md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[var(--text)]">
            {author} – {date}
          </p>
          {image && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg bg-[var(--text)]/5">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}
          {content && (
            <div
              id="post-content"
              className="mt-8"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          <div className="mt-12 border-t border-[var(--text)]/10 pt-8">
            <Comments />
          </div>
        </div>
      </div>
    </article>
  );
}
