<!--
*** Obrigado por estar vendo o nosso README. Se você tiver alguma sugestão
*** que possa melhorá-lo ainda mais dê um fork no repositório e crie uma Pull
*** Request ou abra uma Issue com a tag "sugestão".
*** Obrigado novamente! Agora vamos rodar esse projeto incrível :D
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://dangarcia-devel.vercel.app">
    <img src="https://dangarcia-devel.vercel.app/favicon.ico" alt="Logo" width="120">
  </a>

  <h3 align="center">Dan Garcia - Portfolio Project Repo</h3>
</p>

Este é o repositório do meu site de portfolio. É open source… fique à vontade para se inspirar.

## 🏃‍♂️ Rodar localmente

Três passos:

1. O projeto usa **pnpm** como gerenciador de pacotes. Recomenda-se ter Node.js 20+ e instalar o pnpm:

```bash
npm install -g pnpm
# ou
corepack enable && corepack prepare pnpm@latest --activate
```

2. Instale as dependências:

```bash
pnpm install
```

3. Suba o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

## 🔥 Feito com

- [Next.js](https://nextjs.org/) (App Router) – Framework React com SSR, SSG e recursos prontos para produção;
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática em cima do JavaScript;
- [Tailwind CSS](https://tailwindcss.com/) – Estilização utilitária e responsiva;
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) – Formulários e validação;
- [Lucide React](https://lucide.dev/) – Ícones em componentes;
- [Utterances](https://utteranc.es/) – Comentários no blog via GitHub Issues;
- [gray-matter](https://github.com/jonschlinkert/gray-matter) + [marked](https://marked.js.org/) – Posts em Markdown.

## 🧁 Estilo de código

- [ESLint](https://eslint.org/) – Lint para JavaScript/TypeScript e JSX;
- [eslint-config-next](https://nextjs.org/docs/app/building-your-application/configuring/eslint) – Regras recomendadas para Next.js.

## 🥳 Contribuição

Contribuições tornam a comunidade open source um lugar melhor para aprender e criar. Qualquer contribuição será **muito apreciada**.

1. Dê fork no projeto
2. Crie uma branch para sua feature (`git checkout -b feature/awesome-feature`)
3. Adicione suas alterações (`git add .`)
4. Faça o commit (`git commit -m 'feat: dando um café pra você'`)
5. Envie a branch (`git push origin feature/awesome-feature`)
6. Abra um Pull Request

## Deploy (Vercel)

O deploy pode ser feito na [Vercel](https://vercel.com/new). Conecte o repositório e use as configurações padrão para Next.js.

Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
