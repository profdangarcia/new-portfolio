import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/types/post";

interface PostItemProps {
  data: PostMeta;
}

export default function PostItem({ data }: PostItemProps) {
  return (
    <Link
      href={`/blog/${data.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--text)]/10 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[var(--text)]/20 dark:bg-[var(--background)]"
    >
      <div className="relative aspect-video w-full bg-[var(--text)]/5">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-bold tracking-wide text-[var(--text-title)]">
          {data.title}
        </h3>
        <p className="line-clamp-2 text-sm text-[var(--text)]">{data.description}</p>
        <span className="mt-auto text-xs text-[var(--text)]">
          {data.author} – {data.date}
        </span>
      </div>
    </Link>
  );
}
