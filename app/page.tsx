import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-24">
      <h1 className="font-display text-4xl font-bold tracking-widest text-[var(--text-title)] md:text-5xl">
        DAN GARCIA
      </h1>
      <p className="max-w-lg text-center text-[var(--text)]">
        Portfolio em construção. Em breve: Banner, Sobre, Techs, Portfólio e
        Contato.
      </p>
      <Link
        href="/blog"
        className="rounded-full bg-[var(--text-title)] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Blog
      </Link>
    </div>
  );
}
