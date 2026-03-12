---
id: 4
title: "SSR, SSG and ISR in Next.js: from Pages Router to App Router"
description: "How the rendering strategies you already know work in the new Next.js with the App Router"
image: "/posts/en/post4-thumb.png"
author: "Daniel Garcia"
date: "06 Mar. 2026"
---

If you’ve been following the blog, you’ve seen how Next.js handled SSR, SSG and ISR in the <a href="/en/blog/nextjs-ssr-and-seo" target="_blank">Pages Router</a>: ```getServerSideProps``` to render on every request, ```getStaticProps``` and ```getStaticPaths``` for static and dynamic routes, and ```revalidate``` to refresh the HTML from time to time. With the **App Router** (and Server Components), the way we declare that behaviour changed — and in many cases became more direct. In this post we’ll compare the old approach with the new one, keeping the same tone as before.

## What changed at the core: Server Components and routes in `app/`

In the App Router, routes live under the ```app``` folder and each **page** is a component that can be **async**. By default it runs on the server (Server Component). We no longer need specially named methods like ```getServerSideProps``` or ```getStaticProps```: the page itself fetches data and Next.js decides if the route is static or dynamic based on what we use and what we export. That already changes how we think about SSR, SSG and ISR.

## SSR (render on every request)

**Before (Pages Router):** pages were static by default. To run on the server on every request you had to implement ```getServerSideProps``` and return ```props``` (or ```notFound```). All code in that function ran on the server.

~~~javascript
// pages/produto/[id].js
export async function getServerSideProps(context) {
  const res = await fetch(`https://api.exemplo.com/produtos/${context.params.id}`)
  const produto = await res.json()

  if (!produto) {
    return { notFound: true }
  }

  return {
    props: { produto },
  }
}

export default function ProdutoPage({ produto }) {
  return <h1>{produto.nome}</h1>
}
~~~

**Now (App Router):** the page is an async component. To make it **dynamic** (SSR-like), we signal that we don’t want static cache — for example by using a **dynamic function** (e.g. ```cookies()``` or ```headers()```) or by exporting ```dynamic = 'force-dynamic'```. Data is fetched directly in the page component.

~~~javascript
// app/produto/[id]/page.tsx
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params
  const res = await fetch(`https://api.exemplo.com/produtos/${id}`, {
    cache: "no-store",
  })
  const produto = await res.json()

  if (!produto) notFound()

  return <h1>{produto.nome}</h1>
}
~~~

In short: **before** it was a separate method (```getServerSideProps```) returning props; **now** it’s the async page plus ```dynamic = 'force-dynamic'``` (and optionally ```cache: 'no-store'``` on fetch) so each request is rendered on the server.

## SSG (static page at build)

**Before (Pages Router):** pages without ```getServerSideProps``` were candidates for static. For pages with data you used ```getStaticProps```, which ran **at build** and produced static HTML.

~~~javascript
// pages/blog/index.js
export async function getStaticProps() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()

  return {
    props: { posts },
  }
}

export default function BlogPage({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
~~~

**Now (App Router):** the **default** is static. If the page doesn’t use dynamic functions and doesn’t export ```dynamic = 'force-dynamic'```, Next builds the route and generates static HTML. You just fetch in the page; fetch is cached at build by default.

~~~javascript
// app/blog/page.tsx
export default async function BlogPage() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
~~~

There’s no special “SSG method” anymore: an async page that doesn’t force dynamic **is** static. The framework figures it out.

## ISR (periodic revalidation)

**Before (Pages Router):** inside ```getStaticProps``` you added a ```revalidate``` key (seconds). The page was static but could be regenerated in the background after that interval.

~~~javascript
export async function getStaticProps() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}
~~~

**Now (App Router):** we don’t return an object with ```props``` and ```revalidate```. We **export** a ```revalidate``` constant from the route. The page stays static and Next revalidates on that interval.

~~~javascript
// app/blog/page.tsx
export const revalidate = 60

export default async function BlogPage() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
~~~

Same idea: static at build, with periodic updates. The config just moved from the “get” to a route export.

## Dynamic routes: from getStaticPaths to generateStaticParams

**Before (Pages Router):** for routes like ```pages/blog/[slug].js``` you had to use ```getStaticPaths``` to say **which slugs** were pre-rendered and how to handle unknown ones (```fallback: false | true | 'blocking'```). ```getStaticProps``` received ```params``` and fetched the post.

~~~javascript
// pages/blog/[slug].js
export async function getStaticPaths() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()
  const paths = posts.map((post) => ({ params: { slug: post.slug } }))

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.exemplo.com/posts/${params.slug}`)
  const post = await res.json()

  if (!post) return { notFound: true }

  return {
    props: { post },
    revalidate: 60,
  }
}

export default function PostPage({ post }) {
  return <article>{/* ... */}</article>
}
~~~

**Now (App Router):** we use **```generateStaticParams```** to declare which params are built. It returns an array of ```{ paramName: value }```. The page receives ```params``` as a **Promise** and fetches inside the component. For ISR we export ```revalidate``` on the same route.

~~~javascript
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const res = await fetch(`https://api.exemplo.com/posts/${slug}`)
  const post = await res.json()

  if (!post) notFound()

  return <article>{/* ... */}</article>
}
~~~

The equivalent of ```fallback: 'blocking'``` is the **default** when using ```generateStaticParams```: a slug not built at build time is generated on the first request. In the App Router we don’t have ```fallback``` with three values; instead we have **```dynamicParams```**:

- **```dynamicParams = true```** (default): dynamic segments not returned by ```generateStaticParams``` are generated on demand.
- **```dynamicParams = false```**: any param not pre-generated returns **404**.

Example: only known slugs valid, everything else 404:

~~~javascript
// app/blog/[slug]/page.tsx
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function PostPage({ params }: Props) {
  // ...
}
~~~

If you don’t export ```dynamicParams```, the default is ```true``` and Next still generates pages on demand. So “fallback” is still there; it’s just controlled by **```dynamicParams```** (true/false).

## Summary

| Concept | Pages Router (old) | App Router (new) |
|--------|---------------------|-------------------|
| **SSR** | ```getServerSideProps``` on the page | Async page + ```export const dynamic = 'force-dynamic'``` (and fetch ```cache: 'no-store'``` if needed) |
| **SSG** | ```getStaticProps``` (and no ```getServerSideProps```) | Async page with no dynamic functions or ```dynamic```; default fetch is cached at build |
| **ISR** | ```revalidate``` inside ```getStaticProps``` return | ```export const revalidate = 60``` on the page |
| **Dynamic routes** | ```getStaticPaths``` with ```paths``` and ```fallback``` | ```generateStaticParams()``` returning ```{ param: value }```; “fallback” via ```dynamicParams = true \| false``` |
| **404** | ```return { notFound: true }``` in the get | Call ```notFound()``` from ```next/navigation``` |

## Pages Router and App Router in the same project

If you still have a **Pages Router** project (```pages/```), you don’t have to migrate everything at once. Next.js lets **both routers coexist**: ```app``` and ```pages``` can live side by side. You can’t have the same URL in both — the App Router wins — so avoid duplicating paths.

For a **gradual migration**, move a bit at a time: keep old pages in ```pages/``` and add or migrate routes under ```app/```. For example migrate a static route like ```/about``` to ```app/about/page.tsx``` and leave the blog in ```pages/blog/``` until you’re ready. When everything is in ```app/```, you can remove ```pages``` (or keep it only for ```pages/api```). No need for a big-bang migration; the Pages Router is still supported.

The mindset is the same: choose between static (SSG), static with periodic refresh (ISR), or per-request (SSR). In the App Router it’s all expressed on the page itself — with config exports (```dynamic```, ```revalidate```) and an async component — instead of fixed method names. If you already get SSR, SSG and ISR from the older posts, you can carry that over to the new model with a few tweaks.

### More?

- Refresh the basics: <a href="/en/blog/nextjs-ssr-and-seo" target="_blank">What you need to know about Next.js and SSR</a> and <a href="/en/blog/nextjs-ssg-and-isr-power" target="_blank">The real power of Next.js with SSG and ISR</a>.
- Official docs: <a href="https://nextjs.org/docs/app/building-your-application/rendering" target="_blank">Rendering in the App Router</a>.
- Want to chat? <a href="/#contact" target="_blank">Drop me a message</a> or find me on socials.
