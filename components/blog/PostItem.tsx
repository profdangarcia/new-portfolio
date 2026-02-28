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
      className="group flex flex-col overflow-hidden rounded border-b-[0.1875rem] border-[#333] bg-[var(--primary)] shadow-[0_0.0625rem_0.125rem_rgba(0,0,0,0.07),0_0.125rem_0.25rem_rgba(0,0,0,0.07),0_0.25rem_0.5rem_rgba(0,0,0,0.07),0_0.5rem_1rem_rgba(0,0,0,0.07),0_1rem_2rem_rgba(0,0,0,0.07),0_2rem_4rem_rgba(0,0,0,0.07)]"
    >
      <div className="relative h-[16.3125rem] w-full shrink-0 overflow-hidden rounded-t transition-[filter] duration-200 group-hover:[&_img]:brightness-[0.8]">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover"
          sizes="(max-width: 48rem) 100vw, 50vw"
        />
      </div>
      <div className="px-1.5 pb-1.5 pt-2.5">
        <h2 className="min-h-[3.125rem] font-bold text-[var(--text-title)]" style={{ fontFamily: "Montserrat, sans-serif", margin: "0.9375rem 0 0.8125rem" }}>
          {data.title}
        </h2>
        <p className="mb-5 min-h-[3.9375rem] text-[var(--text)]">{data.description}</p>
        <span className="text-[0.6875rem] text-[#b9b9b9]">
          {data.author} – {data.date}
        </span>
      </div>
    </Link>
  );
}
