---
id: 1
title: "What you need to know about NextJS and SSR"
description: "In this first post we'll talk about NextJS and the benefits of using SSR (Server Side Rendering)"
image: "/posts/post1-thumb.png"
author: "Daniel Garcia"
date: "20 Mar. 2021"
edited: "02 Apr. 2021"
---

[Next.js](https://nextjs.org/) is a powerful framework that makes our lives easier when working with React. Packed with front-end optimizations, the tool is here to solve many of the everyday problems we face in web development.

Besides the ease of adding new configuration to the base project, the straightforward mechanisms for creating application routes, and keeping React’s [Single Page Application (SPA)](https://www.devmedia.com.br/ja-ouviu-falar-em-single-page-applications/39009) model, Next.js lets us work with **SSR (Server Side Rendering)**, **SSG (Static Site Generation)**, and a mix of both. In this post we’ll explore the first of these: SSR.

## SSR

Server Side Rendering, or SSR, means that your page is rendered on the server, not in the browser. When using SSR we need to keep in mind that every request to that page will require a server (or machine) running and ready to do all the work needed to generate the page and send it to the user.

So it’s a very different process from the traditional setup where the page is just HTML, CSS and JavaScript files that the browser can interpret and display. We’re still dealing with the same kind of output — it’s the only thing the browser understands — but those files are generated dynamically on a Node server (provided by the Next.js app itself) and only then sent to the user. Sounds more expensive than serving pre-built files, right?

And it is! But if it exists, there’s a reason. We’ll see below when to use SSR.

## Dynamic pages, JavaScript and crawlers

![SEO](https://agenciatropica.com.br/wp-content/uploads/2018/01/SEO-gif.gif)

Getting your page to the top of search results (I’m not just talking about Google — BING, SPONSOR ME!) has become more and more valuable for any business. There are many strategies for that (you can pay for ads too), but the main term for how well your page performs for search engines is **SEO — Search Engine Optimization**.

There are many good practices when building a site that make it more relevant to crawlers (content-indexing bots), and the more you follow them, the better your chances of ranking well.

Imagine an e-commerce where each product page is unique and needs a server request to load name, prices and all product info. If that request is driven by JavaScript, here’s the issue: crawlers visit pages to analyze written content (HTML tags and text), and they often do it **with JavaScript disabled**. What would Google’s bot see when trying to index that page? Probably almost nothing useful, and that e-commerce wouldn’t show up properly in search.

What does SSR have to do with it? It solves that problem. If, when the user requests the page, all the work is done on the server — including fetching those dynamic data — the page arrives at the client and the crawlers already complete. Problem solved. The e-commerce can rank properly. 🙌

## Using SSR in Next.js

Before you start using it, remember that SSR shouldn’t be your first choice for every page. Serving static pages gives better performance and a smoother experience. Use SSR for pages that are highly dynamic and where you care about search visibility.

Using Server Side Rendering in Next.js is straightforward. Any file that represents a [page](https://nextjs.org/docs/routing/introduction) can export an async function called ```getServerSideProps```. When you add this function to a route, Next.js will run all the page logic on the server before sending the response. Here’s an example:

~~~javascript
export async function getServerSideProps(context) {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product: data
    },
  }
}
~~~

```getServerSideProps``` must return an object with either a ```props``` key or ```notFound```. The first is the data passed as props to your page component. The second is a boolean that makes Next.js respond with a 404.

Simple, right? Just remember: everything in this function runs **ON THE SERVER**, so you don’t have browser globals like ```window```, and you can’t use ```sessionStorage``` or ```localStorage```.

Next.js also offers other ways to serve pages. Want to see them? Keep reading: <a href="/en/blog/nextjs-ssg-and-isr-power" target="_blank">The real power of Next.js with SSG and ISR</a>.

### More?

- Want to learn more about Next.js? Check the <a href="https://nextjs.org/docs/getting-started" target="_blank">official docs</a>.
- Want more posts like this? <a href="/#contact" target="_blank">Drop me a message</a> or find me on socials.
