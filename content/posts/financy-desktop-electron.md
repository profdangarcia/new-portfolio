---
id: 5
title: "Do React + GraphQL ao instalador Windows: empacotando o Financy com Electron"
description: "Como levei um app web React com API GraphQL para um instalador Windows funcional — e o que aprendi no caminho"
image: "/posts/post5-thumb.png"
author: "Daniel Garcia"
date: "10 Mar. 2026"
---

Nunca tinha usado Electron na vida, e no projeto eu ainda não tinha nenhuma estrutura pronta para desktop. O que eu tinha era a **vontade**: transformar o app web em um **app desktop offline**, com instalador para Windows, para o usuário usar sem abrir o navegador. Se você está pensando em fazer algo parecido, este post pode ajudar: conto o contexto do projeto, o que precisei mudar no front e no back, como tudo se encaixa no desenvolvimento e no instalador e, por fim, os problemas que apareceram e como resolvi cada um.

Não sou especialista em Electron e não tenho certeza se todas as abordagens que escolhi foram de fato as melhores — minha preocupação era ter um **app funcional**. Se alguém com mais experiência no ecossistema puder sugerir melhorias ou alternativas, sugestões são sempre bem-vindas (pode comentar aqui no post ou me mandar uma mensagem).

## De que projeto estou falando?

O **Financy** é um app de finanças pessoais: o usuário cadastra categorias (receitas e despesas), registra transações e acompanha um resumo por período em um dashboard. A stack que já existia era:

- **Frontend:** React com TypeScript, Vite, Apollo Client para GraphQL, React Router, Tailwind CSS.
- **Backend:** Node.js com TypeScript, Express, Apollo Server, TypeGraphQL, Prisma e SQLite.

Ou seja: uma API GraphQL na porta 4000 e uma SPA que consome essa API. A ideia era manter essa mesma base e, em cima dela, ter uma “janela desktop” que o usuário instala no Windows e usa offline, sem precisar abrir o navegador nem rodar nada no terminal.

## O que mudou no frontend?

O frontend em si (telas, GraphQL, estado) continuou igual. O que mudou foi a **forma de carregar e de rotear** quando o app deixa de ser servido por um dev server (localhost:5173) e passa a ser aberto a partir de arquivos estáticos no disco.

1. **Base path no Vite**  
   No `vite.config.ts` defini `base: './'`. Assim, no build, os assets (JS, CSS, imagens) passam a ser referenciados com caminhos relativos. Quando o Electron carrega o `index.html` via `file://`, o navegador consegue resolver esses caminhos e a aplicação carrega sem ficar em branco.

2. **Router: HashRouter no desktop, BrowserRouter em dev**  
   Com protocolo `file://`, não existe servidor para fazer fallback de rotas: um refresh em `/dashboard` quebraria. Por isso no `main.tsx` do frontend usei **HashRouter** quando `window.location.protocol === 'file:'` e **BrowserRouter** quando for `http:` (desenvolvimento). No desktop, as rotas ficam tipo `file:///.../index.html#/dashboard`, e o React Router segue funcionando normalmente.

3. **API GraphQL**  
   O Apollo Client continua apontando para `http://localhost:4000/graphql`. Em desenvolvimento o backend roda na 4000; no app instalado, o backend sobe dentro do próprio Electron na mesma porta. Para o frontend não muda nada: em ambos os casos a API está em localhost:4000.

## O que mudou no backend?

O backend continuou sendo a mesma API GraphQL (resolvers, Prisma, autenticação). As mudanças foram para ele **rodar de dois jeitos**: sozinho no terminal (como hoje) e **dentro do processo do Electron** quando for o app instalado.

1. **Exportar `startServer(options)`**  
   A lógica que antes ficava só dentro de um `bootstrap()` virou uma função **`startServer(options)`** exportada, que recebe opções como `port`, `databaseUrl`, `corsOrigin`, `emitSchemaFile` (e o que mais for necessário). Dentro dela, o Express e o Apollo Server são configurados e o `app.listen()` retorna o `http.Server`, para o Electron poder chamar `server.close()` ao fechar o app.

2. **Chamar `startServer()` só quando for o entry point**  
   Para não quebrar o uso “normal” do backend (por exemplo `npm run dev` com tsx ou `node dist/src/index.js`), o `index.ts` só chama `startServer()` quando o arquivo está sendo executado como entry point. Isso é detectado pelo `process.argv[1]`: se terminar em `index.js` ou `index.ts`, é o main e sobe o servidor; caso contrário (quando o arquivo é importado pelo Electron), não sobe nada, só exporta a função.

3. **Imports relativos com extensão `.js`**  
   O backend usa ESM (`"type": "module"`). No Node, imports relativos precisam da extensão. Então em todo import relativo (resolvers, services, graphql/context, etc.) usei `.js` no final (por exemplo `'./resolvers/health.resolver.js'`). O TypeScript continua resolvendo os tipos pelos `.ts`; o código emitido fica correto para o Node no app empacotado.

4. **Banco no app instalado**  
   No desktop, o `DATABASE_URL` aponta para um SQLite na pasta de userData do Electron (por exemplo `.../AppData/Roaming/Financy/financy.db`), em vez de um banco de desenvolvimento. O backend não precisa “saber” se está em dev ou no instalador: ele só recebe a URL do banco via opções ou env.

## Como fica o desenvolvimento no dia a dia

Em dev continuo com **três terminais**:

1. **Backend:** `cd backend && npm run dev` — sobe a API GraphQL na porta 4000 (e roda migrações se precisar).
2. **Frontend:** `cd frontend && npm run dev` — Vite na 5173 com hot reload.
3. **Desktop:** `cd desktop && npm run dev` — compila o main process do Electron e abre a janela. A janela carrega **`http://localhost:5173`**, ou seja, o mesmo frontend que está rodando no Vite. O frontend na janela fala com o backend na 4000. Nada de arquivos estáticos nem `file://` em dev.

Assim você desenvolve com a mesma experiência de antes: altera o frontend ou o backend e vê o resultado na janela do Electron sem precisar gerar instalador.

## Como montei o instalador

Montei o fluxo do **instalador** em cima de scripts e da configuração do electron-builder:

1. **Build do backend**  
   Um script (por exemplo `prepare-backend.js`) roda o build do backend (`prisma generate`, `tsc`), copia `dist`, `prisma` e `package.json` para uma pasta (por exemplo `backend-packaged`) e roda `npm install --omit=dev` nela. Essa pasta é o “backend pronto para produção” que vai dentro do instalador.

2. **Build do frontend**  
   O Vite gera o build do frontend (com `base: './'`). Os arquivos gerados são copiados para uma pasta que o Electron usa (por exemplo `frontend-dist` dentro do projeto desktop).

3. **electron-builder**  
   O builder empacota o código do desktop (main process), a pasta do frontend buildado e, em **extraResources**, a pasta do backend (por exemplo `backend-packaged` copiada como `backend` em `resources`). No Windows, isso vira o instalador NSIS que o usuário executa.

4. **O que acontece quando o usuário abre o app instalado**  
   O processo principal do Electron inicia e, como está empacotado:
   - Roda as **migrações** do Prisma (spawn do Node com o CLI do Prisma, usando como `cwd` a pasta `resources/backend` e `DATABASE_URL` apontando para o SQLite na userData).
   - Faz **dynamic import** do entry do backend (`resources/backend/dist/src/index.js`) e chama **`startServer({ port: 4000, databaseUrl, emitSchemaFile: false })`**. O servidor sobe **no mesmo processo** do Electron, sem depender de ter o Node no PATH.
   - Cria a **janela** e carrega o frontend via `win.loadFile(indexHtml)` — ou seja, o `index.html` dos arquivos estáticos que foram copiados. O frontend carrega com protocolo `file:`, usa HashRouter e continua chamando `http://localhost:4000/graphql`. O backend já está ouvindo nessa porta.

No fim das contas, no instalador tudo funciona: uma única janela, backend e frontend integrados, banco local na máquina do usuário.

## Problemas que apareceram (e como resolvi)

Foi nesse caminho que esbarrei nos problemas abaixo — e nas soluções que adotei.

### **1.** No Windows, o backend nem subia (ERR_CONNECTION_REFUSED)

**O que acontecia:** No app instalado, a interface abria, mas as requisições para `http://localhost:4000/graphql` falhavam com **ERR_CONNECTION_REFUSED**. O backend não estava no ar.

**Por quê:** A primeira ideia foi subir o backend como **processo separado** com `spawn("node", [entryPath], ...)`. No Windows, ao abrir o app pelo atalho ou pelo executável, o processo do Electron não herdava um ambiente com o **Node no PATH**. O `spawn` não encontrava o `node` ou falhava, e o backend nunca iniciava.

**O que fiz:** Deixei de depender do Node no PATH. O backend passou a ser **carregado e iniciado dentro do processo principal do Electron** (dynamic import do entry e chamada a `startServer()`). O servidor sobe no mesmo processo, sem precisar de um `node` externo. As migrações continuaram via spawn do Prisma (nesse caso ainda é preciso ter o Node acessível no PATH ou outra estratégia futura).

### **2.** Porta 4000 em uso ao reabrir o app

**O que acontecia:** Ao fechar o app e abrir de novo, aparecia erro de “Backend não iniciou” ou “porta 4000 em uso”. Em alguns cenários parecia um loop de tentativas de subir e matar processos.

**Por quê:** Com o backend em processo separado, ao fechar o Electron o processo do backend **não era encerrado corretamente**. Sobrava um processo “zumbi” segurando a porta 4000; na próxima abertura o novo backend não conseguia subir.

**O que fiz:** Com o backend **in-process**, não há processo separado para matar. No encerramento do app (`window-all-closed` e `before-quit`), chamei **`server.close()`** no `http.Server` retornado por `startServer()`, liberando a porta. Na próxima abertura a porta está livre e o servidor sobe de novo.

### **3.** “Cannot find module” no app instalado (health.resolver, etc.)

**O que acontecia:** Depois de colocar o backend in-process, ao abrir o app instalado aparecia **Cannot find module** para arquivos como `health.resolver` (ou outros resolvers). O `index.js` do backend carregava, mas os imports internos (por exemplo `./resolvers/health.resolver`) não eram encontrados.

**Por quê:** Com `"type": "module"`, o Node não adiciona `.js` sozinho nos imports. O TypeScript compila sem alterar os paths, então o código gerado continua com `from './resolvers/health.resolver'`. O Node procura um arquivo com esse nome literal (sem extensão) e não acha — o que existe é `health.resolver.js`.

**O que fiz:** Incluí a extensão **`.js`** em **todos** os imports relativos do backend (e para pastas com `index`, usar `context/index.js` explicitamente). O TypeScript continua resolvendo os tipos pelos `.ts`; o emitido fica compatível com a resolução ESM do Node no app empacotado.

### **4.** npm run dev não subia o servidor

**O que acontecia:** Em desenvolvimento, ao rodar o backend com `tsx watch src/index.ts`, o servidor não subia e não aparecia a mensagem “Servidor iniciado na porta 4000!”.

**Por quê:** A condição para chamar `startServer()` era algo como `process.argv[1]?.endsWith('index.js')`. No app empacotado o entry é `dist/src/index.js`; em dev o comando é `tsx watch src/index.ts`, então o path em `argv[1]` termina em **`index.ts`**. A condição falhava e o servidor não era iniciado no dev.

**O que fiz:** Passei a considerar os dois casos como entry: **`entry.endsWith('index.js') || entry.endsWith('index.ts')`**. Assim tanto o build/desktop quanto o `npm run dev` com tsx disparam o `startServer()`. Aproveitei e ajustei o fallback da porta para não usar `Number(process.env.PORT) ?? 4000` (que vira `NaN` quando `PORT` não está definido), usando `process.env.PORT ? Number(process.env.PORT) : 4000`.

## Resumindo

| Problema | Causa | Solução |
|----------|--------|--------|
| Backend não sobe no Windows (ERR_CONNECTION_REFUSED) | `spawn("node", ...)` sem Node no PATH no app instalado | Backend in-process: dynamic import + `startServer()` |
| Porta 4000 em uso ao reabrir o app | Processo do backend não era encerrado | Sem processo separado; `server.close()` no quit |
| Cannot find module (health.resolver, etc.) | ESM no Node exige extensão nos imports relativos | Incluir `.js` em todos os imports relativos do backend |
| `npm run dev` não inicia o servidor | Condição “main” só considerava `index.js` | Considerar `index.js` ou `index.ts` como entry |

No fim, consegui gerar o **instalador funcional para Windows**: o usuário instala, abre o app, as migrações rodam (quando houver Node no PATH para o spawn do Prisma), o backend sobe dentro do Electron e a interface React consome a API GraphQL em localhost:4000. A mesma base (React + Vite + GraphQL + Apollo Server) segue funcionando em desenvolvimento com dois terminais; no desktop, vira um único executável com tudo empacotado — tudo isso sem ter partido de uma estrutura pronta nem de experiência prévia com Electron, só da vontade de ter o app web como desktop offline e funcional.

Para dar uma ideia do resultado, abaixo estão as **métricas do app na versão desktop**: uso de memória dos processos Electron em execução, tamanho do executável gerado e espaço ocupado após a instalação.

![Métricas do Financy desktop: processos e memória, executável Windows e tamanho instalado](/posts/assets/financy-desktop-metrics.png)

<p class="post-figcaption"><em>Uso de memória em execução (~131,3 MB nos processos Electron), tamanho do executável Windows (174,6 MB) e espaço em disco após instalação (625 MB).</em></p>

### Mais?

- **Quer ver o merge request com todas as alterações (e o fluxo de commits caótico)?** <a href="https://github.com/profdangarcia/ftr-second-challenge/pull/3" target="_blank">Pull Request — Desktop App</a>.
- Documentação do <a href="https://www.electron.build/" target="_blank">electron-builder</a>.
- <a href="https://nodejs.org/api/esm.html#mandatory-file-extensions" target="_blank">Node.js ESM e extensão .js nos imports</a>.
- Quer trocar uma ideia? <a href="/#contact" target="_blank">Manda uma mensagem</a> ou me encontre nas redes sociais.
