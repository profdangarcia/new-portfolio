import Image from "next/image";
import type { CompletePost } from "@/types/post";
import { Comments } from "./Comments";

interface BlogPostProps {
  data: CompletePost;
}

export default function BlogPost({ data }: BlogPostProps) {
  const { title, image, content, author, date } = data;

  return (
    <main className="min-h-[70vh] bg-[var(--background)] py-[1.875rem]">
      <div className="container-portfolio">
        <article className="mx-auto flex max-w-3xl flex-col text-[0.9375rem] md:text-[1.0625rem]">
          <h1
            className="font-bold text-[var(--text-title)] text-[1.375rem] md:text-[1.875rem]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {title}
          </h1>
          <p className="mt-1 text-xs font-medium text-[var(--text-title)] md:text-sm">
            {author} – {date}
          </p>
          {image && (
            <div className="relative my-5 mx-auto w-full max-w-[37.5rem] overflow-hidden rounded-[0.25rem]">
              <Image
                src={image}
                alt={title}
                width={600}
                height={340}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 48rem) 100vw, 37.5rem"
              />
            </div>
          )}
          {content && (
            <div
              id="post-content"
              className="mt-0"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          <div className="mt-10 w-full border-t border-[#777]/10 pt-8">
            <Comments />
          </div>
        </article>
      </div>
    </main>
  );
}
