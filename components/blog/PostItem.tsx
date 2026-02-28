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
      className="group flex flex-col overflow-hidden rounded-[0.25rem] border-b-[0.1875rem] border-[#333] bg-white no-underline shadow-[0_1px_2px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.07),0_4px_8px_rgba(0,0,0,0.07),0_8px_16px_rgba(0,0,0,0.07),0_16px_32px_rgba(0,0,0,0.07),0_32px_64px_rgba(0,0,0,0.07)]"
    >
      <div className="relative h-[16.3125rem] w-full shrink-0 overflow-hidden rounded-t-[0.25rem]">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover transition-[filter] duration-200 ease-in-out group-hover:brightness-[0.8]"
          sizes="(max-width: 48rem) 100vw, 50vw"
        />
      </div>
      <div className="px-[0.3125rem] pb-[0.3125rem] pt-[0.625rem]">
        <h2
          className="min-h-[3.125rem] font-bold text-[#333]"
          style={{
            fontFamily: "Montserrat, sans-serif",
            margin: "0.9375rem 0 0.8125rem",
          }}
        >
          {data.title}
        </h2>
        <p className="mb-5 min-h-[3.9375rem] text-[#777]">
          {data.description}
        </p>
        <span className="text-[0.6875rem] text-[#b9b9b9]">
          {data.author} – {data.date}
        </span>
      </div>
    </Link>
  );
}
