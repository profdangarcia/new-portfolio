import Image from "next/image";
import type { CompletePost } from "@/types/post";
import { Comments } from "./Comments";

interface BlogPostProps {
  data: CompletePost;
}

export default function BlogPost({ data }: BlogPostProps) {
  const { title, image, content, author, date } = data;

  return (
    <article className="min-h-[70vh] bg-[var(--background)] py-[1.875rem]">
      <div className="container-portfolio">
        <div className="mx-auto max-w-3xl text-[0.875rem] md:text-[1rem]">
          <h1 className="font-bold text-[var(--text-title)] text-[1.375rem] md:text-[1.875rem]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {title}
          </h1>
          <p className="mt-2 text-[0.6875rem] text-[#b7b7b7] md:text-[0.75rem]">
            {author} – {date}
          </p>
          {image && (
            <div className="relative my-5 mx-auto aspect-video w-full max-w-[37.5rem] overflow-hidden rounded">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 48rem) 100vw, 37.5rem"
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
