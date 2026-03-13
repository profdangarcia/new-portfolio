import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/types/post";

interface PostItemProps {
  data: PostMeta;
  basePath?: string;
  featured?: boolean;
}

export default function PostItem({ data, basePath = "/blog", featured = false }: PostItemProps) {
  return (
    <Link
      href={`${basePath}/${data.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] no-underline shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden bg-[var(--background)] ${
          featured ? "h-56 aspect-video md:h-auto md:w-3/5 md:aspect-video" : "h-52"
        }`}
      >
        <Image
          src={data.image}
          alt={data.title}
          fill
          className={`object-cover transition-all duration-200 group-hover:scale-105 ${
            featured ? "object-top" : "object-center"
          }`}
          sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 48rem) 100vw, 50vw"}
          priority={featured}
          fetchPriority={featured ? "high" : "auto"}
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2
          className={`font-bold text-[var(--text-title)] ${
            featured ? "text-lg md:text-xl" : "text-base"
          }`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {data.title}
        </h2>
        <p
          className={`mt-2 text-[var(--text)] ${
            featured ? "line-clamp-3 text-base" : "line-clamp-2 text-sm"
          }`}
        >
          {data.description}
        </p>
        <span className="mt-auto pt-3 text-xs text-[var(--text-muted)]">
          {data.author} – {data.date}
        </span>
      </div>
    </Link>
  );
}
