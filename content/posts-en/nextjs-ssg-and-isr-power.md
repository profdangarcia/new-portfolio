---
id: 2
title: "The real power of Next.js with SSG and ISR"
description: "Meet the Next.js features that made it the go-to React framework and a solid alternative to SSR"
image: "/posts/en/post2-thumb.png"
author: "Daniel Garcia"
date: "02 Apr. 2021"
---

In the <a href="/en/blog/nextjs-ssr-and-seo" target="_blank">previous post</a> I showed how Next.js can render content on the server and send it ready to the client — that’s SSR (server side rendering). As important as it is, SSR should only be used when you really need it, since every request will hit the server and can lead to slowdowns and other issues under heavy traffic or without the right setup.

Today we’ll look at other options the framework gives us to handle dynamic pages in a static way: **SSG (static site generation)** and **ISR (incremental static regeneration)**.

In both cases the goal is to generate static pages that can be served via <a href="https://www.akamai.com/br/pt/cdn/what-is-a-cdn.jsp" target="_blank">CDN</a>, <a href="https://docs.aws.amazon.com/pt_br/AmazonS3/latest/userguide/UsingBucket.html" target="_blank">S3 buckets</a>, and the like, giving you great performance without a server handling every request.

In this post we’ll go through these two mechanisms and how to use them.

## SSG – Static Site Generation

SSG is the ability to generate static pages from your React code. Every page in your Next.js app can be turned into static HTML, JS, and CSS that power your site and are served to users. This is already the default for every new page (each route) in a Next app. At build time the framework figures out which pages can be statically generated — that’s <a href="https://nextjs.org/blog/next-9#automatic-static-optimization" target="_blank">Automatic Static Optimization</a>. Let’s see how it decides.

In the post about SSR we marked pages for server rendering by implementing ```getServerSideProps```. What about the ones that don’t? They’re all generated as static at build time. That already makes Next.js a great tool for building sites, but can it do the same for pages that need dynamic data — like a blog listing? Yes! 🎉

![Victory dance](https://gif-avatars.com/img/200x200/cachorro-e-menino-dancando.gif)

Just like ```getServerSideProps```, any Next page can implement ```getStaticProps```. The code in that function runs on the Node server provided by the framework, but this time **at build time**. For example, if you need to fetch all (or some) of your blog posts from a CMS — title, author, etc. — you do the fetch in this method, shape the data, and return the props. All of that happens during the build, so you get a static page. Here’s an example:

~~~javascript
export async function getStaticProps(context) {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
  }
}
~~~

Really powerful! But you might wonder: when new posts are added, do I need to rebuild and redeploy to get a new static page? Yes — unless we use the other feature we’re about to see: Incremental Static Regeneration.

## ISR – Incremental Static Regeneration

When we talked about SSR we saw that ```getServerSideProps``` must return an object with either ```props``` or ```notFound```. The same is true for ```getStaticProps```, but we get one extra option.

Along with ```props``` we can add a ```revalidate``` key with a number of seconds. That optional value is what enables ISR. With it set, once every that many seconds the Next server will run ```getStaticProps``` again and produce a fresh static page. So we get a mix of SSR and SSG: only one request in that window triggers a server render. For the example above we’d do:

~~~javascript
export async function getStaticProps(context) {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60, // 1 minute
  }
}
~~~

Every minute a new static page would be generated, and new posts would show up. Isn’t that a powerful tool?

![Mind blow](https://media1.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif)

One more question you might have: ```getStaticProps``` is clear for a fixed route like **/blog**. But what about a dynamic route like **/blog/[postSlug]**? That’s what we look at next.

## SSG and ISR for dynamic routes

In a Next.js app, each file under ```pages``` is a route — e.g. ```pages/blog/index.jsx``` is **/blog**. To have a route that takes a parameter (recovered via <a href="https://blog.rocketseat.com.br/tipos-de-parametros-nas-requisicoes-rest/#:~:text=%E2%9C%85%20Route%20params,dados%20da%20requisi%C3%A7%C3%A3o%20na%20rota.&text=Nesse%20exemplo%20acima%20busco%2C%20atualizo,%3A%20tgmarinho%20ou%20id%3A%20380327." target="_blank">route params</a>), you use **brackets** in the filename. So ```pages/blog/[postSlug].jsx``` matches any **/blog/some-post**. How do we statically generate all those possible slugs?

Next.js has a simple answer: when you use ```getStaticProps``` on a dynamic route, you must also implement **```getStaticPaths```**. That second method does two things: it defines **which slugs are pre-rendered at build time** and **how Next should handle requests for slugs that weren’t pre-generated**. Here’s how they work together:

~~~javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { postSlug: 'my-post-1'} },
      { params: { postSlug: 'my-post-2'} },
      { params: { postSlug: 'my-post-3'} }
    ],
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.postSlug}`)
  const post = await res.json()

  if(!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post },
    revalidate: 60, // 1 minute
  }
}
~~~

At build time, ```getStaticPaths``` tells ```getStaticProps``` which **paths** to generate. It returns an object with **paths** and **fallback**. **Paths** is an array of objects like:

~~~javascript
  {
    params: {
      param1: '...',
      param2: '...'
    }
  }
~~~

Each dynamic segment of the route must appear in **params**. You can also fetch the list of paths inside ```getStaticPaths```:

~~~javascript
export async function getStaticPaths() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()
  const paths = posts.map(post => {
    return {
      params: { postSlug: post.slug }
    }
  })

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.postSlug}`)
  const post = await res.json()

  if(!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post },
    revalidate: 60, // 1 minute
  }
}
~~~

In that case, one static page is generated per post at build time. Be careful with large sets — for thousands of posts you might want to limit how many you pre-generate. An e-commerce could pre-build only the top 20 products, for example.

Now we need to understand **fallback**.

## Static paths and fallback

As we said, ```getStaticPaths``` decides which pages are built at build time (**paths**) and how to handle requests for params that weren’t pre-built — that’s **fallback**.

There are three valid values: **false**, **true**, or **'blocking'**. Here they are.

### fallback: false

The simplest case. If you’re sure every valid path is in ```getStaticPaths``` and was built, ```fallback: false``` means any request for a param not in **paths** gets a **404**.

With the example above, **/blog/my-post-1** works, and **/blog/my-post-4** returns 404.

### fallback: 'blocking'

Usually we don’t pre-build every dynamic page, but we still want valid slugs (e.g. an existing post) to eventually become static. With ```fallback: 'blocking'```, the **first** request to a path not in **paths** behaves like SSR: the server generates the page, and from then on it’s cached. The first user might wait a bit; the rest get the static version.

### fallback: true

If you don’t want the user to wait with no feedback, use ```fallback: true```. Then:

- The user hits a path not in **paths**;
- The page loads right away (e.g. with a loading state);
- When data is ready, the page updates with content or 404;
- Later requests get the cached static page.

You need to handle the fallback state in the page, e.g. with **useRouter()** and ```router.isFallback```:

~~~javascript
// pages/posts/[id].js
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <YourAmazingPostPage />
  )
}
~~~

## Wrapping up

With Next.js we can choose how each page is rendered. SSG and ISR helped make the framework so popular and are a great fit for many projects.

Even so, SSR is still needed sometimes — for example for authenticated requests that must run on the server.

REMEMBER: everything in ```getStaticProps``` and ```getStaticPaths``` runs **ON THE SERVER**. You don’t have browser globals like ```window```, and you can’t use ```sessionStorage``` or ```localStorage```.

I hope this gave you a good overview of the tool and its rendering options.

### More?

- Want to learn more about Next.js? Check the <a href="https://nextjs.org/docs/getting-started" target="_blank">official docs</a>.
- Missed the SSR post? See it <a href="/en/blog/nextjs-ssr-and-seo" target="_blank">here</a>.
- Want more posts like this? <a href="/#contact" target="_blank">Drop me a message</a> or find me on socials.
