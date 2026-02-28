---
id: 3
title: "Refazendo o portfolio: Next.js, Tailwind e uma ajudinha do Cursor"
description: "Um relato sobre o processo de criação do novo portfolio com ferramentas mais atuais e o uso de IA no fluxo de desenvolvimento"
image: "/posts/post3-thumb.png"
author: "Daniel Garcia"
date: "28 Fev. 2026"
---

Quem acompanha o blog já viu por aqui posts sobre <a href="/blog/nextjs-ssr-e-seo" target="_blank">NextJS e SSR</a> e sobre <a href="/blog/entenda-nextjs-ssg-isr" target="_blank">SSG e ISR</a>. O portfolio que eu mantinha na época era justamente aquele projeto em Next.js com Pages Router, Styled Components e uma stack que já estava me servindo muito bem. Com o tempo, porém, surgiu a vontade de atualizar o site: melhorar performance, aproveitar o App Router, usar CSS mais direto e ainda experimentar ferramentas que estão mudando a forma como a gente codifica. Daí veio a ideia de **refazer o portfolio do zero** com ferramentas mais novas e registrar um pouco desse processo aqui.

Neste post falo sobre as escolhas de stack, o que mudou em relação ao projeto antigo e como o <a href="https://cursor.com/" target="_blank">Cursor</a> entrou no fluxo como parceiro de código e revisão.

## Por que refazer?

O projeto antigo funcionava bem: Next.js com Pages Router, TypeScript, Styled Components, deploy na Vercel. Mas o ecossistema evoluiu. O **App Router** passou a ser o modelo recomendado pelo Next.js, com Server Components, layouts aninhados e uma forma de lidar com dados e rotas que simplifica muita coisa. Manter um projeto legado é válido, mas para um portfolio pessoal fazia sentido realinhar com as práticas atuais e, de quebra, reaproveitar conteúdo e ideias sem carregar decisões antigas.

Além disso, queria algo mais leve na parte de estilos. **Tailwind CSS** entra aí: utility-first, sem precisar nomear tantos componentes de estilo, e com um resultado final enxuto. Para um site com poucas páginas e foco em conteúdo e performance, caiu como uma luva.

## Stack do novo portfolio

O novo projeto foi levantado com:

- **Next.js 16** (App Router) – rotas em `app/`, Server Components por padrão, `generateStaticParams` para os posts, metadata e SEO direto no arquivo da rota.
- **TypeScript** – continua sendo a base para tipagem e autocomplete.
- **Tailwind CSS 4** – estilização via classes, design responsivo e tema (cores, fontes) centralizado no CSS.
- **React Hook Form + Zod** – formulário de contato com validação e menos boilerplate.
- **Markdown para o blog** – posts em arquivos `.md` na pasta `content/posts`, com **gray-matter** e **marked** para front matter e conversão para HTML. Nada de CMS nesse primeiro momento.
- **Utterances** – comentários no blog atrelados a issues do GitHub, sem backend próprio.

Ou seja: menos dependências pesadas, mais uso do que já vem no ecossistema Next.js e React, e foco em conteúdo estático e formulário de contato.

## O que mudou em relação ao projeto antigo

Além da troca de Pages Router para App Router e de Styled Components para Tailwind, algumas decisões foram repensadas:

- **Fontes** – uso de `next/font` (Poppins, Montserrat, Six Caps) com variáveis CSS, sem depender de link externo.
- **Blog** – posts continuam em Markdown, mas a leitura e a geração de HTML acontecem no servidor; cada post vira uma rota estática em build.
- **Comentários** – o script do Utterances é injetado em um **container estável** definido no layout da rota do post, para evitar o famoso erro de `insertAdjacentHTML` em elemento sem pai quando se navega entre posts pelo client-side. Esse detalhe rende um post técnico à parte, mas em resumo: o container fica no layout, não no componente que desmonta na navegação.
- **Formulário de contato** – envio via API Route com Nodemailer (ou outro transport), validação com Zod e React Hook Form, e feedback claro de sucesso/erro.

Tudo isso mantendo o site estático na maior parte do tempo, com deploy na Vercel e boa experiência em SEO e performance.

## Cursor no fluxo de desenvolvimento

Aqui entra a parte em que dou crédito a uma ferramenta que tem feito diferença no dia a dia: o **Cursor**.

O Cursor é um editor baseado em VS Code que integra modelos de IA ao fluxo de codificação. Não substitui o raciocínio técnico nem as decisões de arquitetura, mas ajuda em tarefas repetitivas, sugestões de código, refatoração e até na exploração de um codebase que você ainda não domina por completo.

No processo de criar o novo portfolio, usei o Cursor para:

- **Estruturar rotas e layouts** no App Router, seguindo a documentação atual do Next.js.
- **Ajustar componentes** para Server/Client quando necessário (por exemplo, o bloco de comentários que depende de `usePathname` e `useEffect`).
- **Corrigir bugs** como o do Utterances na navegação entre posts – a IA sugeriu a leitura de issues conhecidas e a solução com container no layout.
- **Manter consistência** de estilo (Tailwind), nomes de arquivos e padrões do projeto.
- **Escrever e revisar trechos deste próprio post** – inclusive a estrutura e o tom para ficarem próximos dos outros textos do blog.

Ou seja, o Cursor atuou como um par de programação sempre disponível: eu definia o que queria (nova rota, correção, texto), e a ferramenta ajudava a rascunhar código e texto alinhados ao resto do projeto. Isso acelerou bastante o desenvolvimento e deixou mais tempo para pensar em conteúdo e UX em vez de só digitar boilerplate.

Se você quiser experimentar, vale dar uma olhada em <a href="https://cursor.com/" target="_blank">cursor.com</a>. Não é obrigatório para nada do que descrevi aqui – tudo dá para fazer “na mão” –, mas para quem curte experimentar novas ferramentas no fluxo de desenvolvimento, faz sentido testar.

## Conclusão

Refazer o portfolio foi uma forma de me atualizar no Next.js e no ecossistema React, adotar Tailwind de ponta a ponta e ainda incorporar o uso de IA no processo de desenvolvimento. O resultado é um site mais simples tecnicamente, fácil de manter e de evoluir, e com espaço para posts como este.

Se você está pensando em modernizar um projeto antigo ou em montar um portfolio do zero, a combinação Next.js (App Router) + TypeScript + Tailwind continua uma aposta muito sólida. E se quiser ir além, experimentar um editor como o Cursor pode abrir um novo jeito de iterar no código.

### Mais?

- Quer saber mais sobre Next.js e App Router? Consulte a <a href="https://nextjs.org/docs" target="_blank">documentação oficial</a>.
- Quer relembrar SSR e SSG/ISR? Veja os posts <a href="/blog/nextjs-ssr-e-seo" target="_blank">O que você precisa saber sobre NextJS e SSR</a> e <a href="/blog/entenda-nextjs-ssg-isr" target="_blank">O verdadeiro poder do NextJS com SSG e ISR</a>.
- Quer ver mais posts como esse? Me mande <a href="/#contact" target="_blank">uma mensagem</a> ou me encontre nas redes sociais.
