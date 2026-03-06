---
id: 4
title: "SSR, SSG e ISR no Next.js: do Pages Router ao App Router"
description: "Como as estratégias de renderização que você já conhece funcionam na nova versão do Next.js com App Router"
image: "/posts/post4-thumb.png"
author: "Daniel Garcia"
date: "06 Mar. 2026"
---

Quem acompanha o blog já viu por aqui como o Next.js tratava SSR, SSG e ISR no <a href="/blog/nextjs-ssr-e-seo" target="_blank">Pages Router</a>: ```getServerSideProps``` para renderizar a cada request, ```getStaticProps``` e ```getStaticPaths``` para páginas estáticas e rotas dinâmicas, e a chave ```revalidate``` para renovar o HTML de tempos em tempos. Com a chegada do **App Router** (e do modelo de Server Components), a forma de declarar esse comportamento mudou — e ficou mais direta em muitos casos. Neste post vamos comparar o que existia antes com o que temos hoje, mantendo a mesma linguagem dos textos anteriores.

## O que mudou na base: Server Components e rotas em `app/`

No App Router, as rotas ficam dentro da pasta ```app``` e cada **page** é um componente que pode ser **assíncrono**. Por padrão, esse componente roda no servidor (Server Component). Não precisamos mais de métodos com nomes específicos como ```getServerSideProps``` ou ```getStaticProps```: a própria página busca os dados e o Next.js decide se a rota será estática ou dinâmica com base no que usamos dentro dela e nas exportações que fazemos. Isso já muda bastante a forma como pensamos em SSR, SSG e ISR.

## SSR (renderização a cada request)

**Antes (Pages Router):** a página era estática por padrão. Para rodar no servidor a cada request, era obrigatório implementar ```getServerSideProps``` e retornar ```props``` (ou ```notFound```). Todo o código desse método rodava no servidor.

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

**Agora (App Router):** a página é um componente assíncrono. Para que ela seja **dinâmica** (comportamento de SSR), precisamos sinalizar que não queremos cache estático. Duas formas comuns: usar uma **função dinâmica** que o Next considera “dinâmica” (por exemplo ```cookies()``` ou ```headers()```) ou exportar ```dynamic = 'force-dynamic'```. Os dados são buscados direto no componente da página.

~~~javascript
// app/produto/[id]/page.tsx
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params
  const res = await fetch(`https://api.exemplo.com/produtos/${id}`, {
    cache: "no-store", // garante que não usa cache
  })
  const produto = await res.json()

  if (!produto) notFound()

  return <h1>{produto.nome}</h1>
}
~~~

Em resumo: **antes** era um método separado (```getServerSideProps```) retornando props; **agora** é a própria page async + ```dynamic = 'force-dynamic'``` (e eventualmente ```cache: 'no-store'``` no fetch) para garantir que cada request gere a página no servidor.

## SSG (página estática no build)

**Antes (Pages Router):** páginas sem ```getServerSideProps``` eram candidatas a estáticas. Para páginas com dados, era preciso usar ```getStaticProps```. O método rodava **no build** e o resultado virava HTML estático.

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

**Agora (App Router):** o **padrão** já é estático. Se a página não usar funções dinâmicas nem exportar ```dynamic = 'force-dynamic'```, o Next faz o **build** da rota e gera HTML estático. Basta buscar os dados no componente da página; o fetch é cacheado no build por padrão.

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

Não existe mais um “método especial” para SSG: a página async que não força dinâmico **é** estática. O framework identifica isso sozinho.

## ISR (revalidação periódica)

**Antes (Pages Router):** no mesmo ```getStaticProps``` a gente adicionava a chave ```revalidate``` com o intervalo em segundos. A página era estática, mas a cada X segundos a próxima request podia disparar uma nova geração em background.

~~~javascript
export async function getStaticProps() {
  const res = await fetch("https://api.exemplo.com/posts")
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60, // revalidar a cada 60 segundos
  }
}
~~~

**Agora (App Router):** não retornamos mais um objeto com ```props``` e ```revalidate```. Exportamos uma **constante** ```revalidate``` na própria rota. A página continua estática, mas o Next revalida no intervalo definido.

~~~javascript
// app/blog/page.tsx
export const revalidate = 60 // segundos

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

A ideia é a mesma: estático no build, com atualização periódica. Só que a configuração sai de dentro do “get” e vira uma export da página.

## Rotas dinâmicas: de getStaticPaths a generateStaticParams

**Antes (Pages Router):** em rotas como ```pages/blog/[slug].js``` era obrigatório usar ```getStaticPaths``` para dizer **quais slugs** seriam pré-renderizados e como lidar com slugs desconhecidos (```fallback: false | true | 'blocking'```). O ```getStaticProps``` recebia ```params``` e buscava o post.

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

**Agora (App Router):** usamos **```generateStaticParams```** para declarar quais parâmetros serão gerados no build. A função retorna um array de objetos no formato ```{ nomeDoParametro: valor }```. A página recebe ```params``` como uma **Promise** e busca o dado dentro do componente. Para ISR, exportamos ```revalidate``` na mesma rota.

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

O equivalente a ```fallback: 'blocking'``` no App Router é o **padrão** quando usamos ```generateStaticParams```: um slug ainda não gerado na build será gerado na primeira request (on-demand). A diferença é que no App Router não existe mais a chave ```fallback``` com três valores (```false```, ```true```, ```'blocking'```). Em troca, usamos a opção **```dynamicParams```** na própria página:

- **```dynamicParams = true```** (padrão): rotas dinâmicas que **não** foram retornadas por ```generateStaticParams``` são geradas sob demanda na primeira request — comportamento análogo ao antigo ```fallback: 'blocking'``` ou ```fallback: true```.
- **```dynamicParams = false```**: qualquer parâmetro que não tenha sido pré-gerado em ```generateStaticParams``` resulta em **404**. Equivalente ao antigo ```fallback: false```.

Exemplo: se você quer que apenas os slugs conhecidos no build sejam válidos e qualquer outro retorne 404:

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

Se não exportar ```dynamicParams```, o padrão é ```true``` e o Next continua gerando páginas on-demand para slugs novos. Ou seja: o “fallback” existe, mas hoje se controla com **```dynamicParams```** (true/false) em vez de ```fallback``` (false/true/'blocking').

## Resumindo a comparação

| Conceito | Pages Router (antigo) | App Router (novo) |
|----------|------------------------|-------------------|
| **SSR** | ```getServerSideProps``` na página | Page async + ```export const dynamic = 'force-dynamic'``` (e fetch com ```cache: 'no-store'``` se precisar) |
| **SSG** | ```getStaticProps``` (e sem ```getServerSideProps```) | Page async sem funções dinâmicas e sem ```dynamic```; fetch padrão já é cacheado no build |
| **ISR** | ```revalidate``` dentro do retorno de ```getStaticProps``` | ```export const revalidate = 60``` na página |
| **Rotas dinâmicas (paths)** | ```getStaticPaths``` com ```paths``` e ```fallback``` | ```generateStaticParams()``` retornando array de ```{ param: value }```; controle de “fallback” com ```dynamicParams = true \| false``` |
| **404** | ```return { notFound: true }``` no get | Chamar ```notFound()``` de ```next/navigation``` |

## Pages Router e App Router no mesmo projeto

Se você ainda tem um projeto usando **Pages Router** (pasta ```pages/```), não precisa migrar tudo de uma vez. O Next.js permite que **as duas formas de roteamento coexistam** no mesmo projeto: a pasta ```app``` convive com a pasta ```pages```. Rotas definidas em ```app/``` e em ```pages/``` não podem responder pela **mesma URL** — nesse caso o App Router tem prioridade e o build pode falhar ou a rota em ```app``` prevalece, então o ideal é não duplicar caminhos.

Para uma **migração gradual**, dá para seguir por partes: deixar as páginas antigas em ```pages/``` e começar a criar novas rotas (ou migrar algumas) dentro de ```app/```. Por exemplo, você pode migrar primeiro a rota estática ```/sobre``` para ```app/sobre/page.tsx``` e manter o blog em ```pages/blog/``` até ter tempo de converter. Assim o projeto continua funcional e você vai trocando pedaço a pedaço. Quando tudo estiver em ```app/```, a pasta ```pages``` pode ser removida (ou mantida só para API routes, se ainda usar ```pages/api```). Não há obrigação de migrar em um big bang; o suporte ao Pages Router segue disponível.

A mentalidade continua a mesma: escolher entre conteúdo estático (SSG), estático com atualização periódica (ISR) ou gerado a cada request (SSR). A diferença é que no App Router tudo isso se expressa na própria página — com export de config (```dynamic```, ```revalidate```) e componente async — em vez de métodos com nomes fixos. Quem já entendeu SSR, SSG e ISR nos posts antigos consegue transpor a lógica para o novo modelo com poucos ajustes.

### Mais?

- Relembre os conceitos: <a href="/blog/nextjs-ssr-e-seo" target="_blank">O que você precisa saber sobre NextJS e SSR</a> e <a href="/blog/entenda-nextjs-ssg-isr" target="_blank">O verdadeiro poder do NextJS com SSG e ISR</a>
- Documentação oficial: <a href="https://nextjs.org/docs/app/building-your-application/rendering" target="_blank">Rendering no App Router</a>
- Quer trocar uma ideia? <a href="/#contact" target="_blank">Manda uma mensagem</a> ou me encontre nas redes sociais.
