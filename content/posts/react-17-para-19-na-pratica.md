---
id: 7
title: "React 17 para 19 na prática: comparações reais e novos hooks"
description: "Veja exemplos práticos de como fazíamos no React 17 e como podemos fazer no React 19, com foco em formulários, performance e experiência de uso"
image: "/posts/post7-thumb.png"
author: "Daniel Garcia"
date: "20 Abr. 2026"
---

Se você trabalha com React no dia a dia, talvez se identifique com uma situação bem comum: no projeto da empresa, muitas vezes estamos em versões mais antigas por questões de legado, prazo ou prioridade, enquanto o ecossistema já está em outro momento.

Esse post nasceu exatamente disso.

Além de compartilhar conteúdo, também uso o blog como material de estudo e atualização. Nem sempre temos espaço para explorar as versões mais novas dentro de projetos reais de trabalho, então transformar esse estudo em post acaba sendo uma forma de aprender melhor e ainda organizar referência para consultas futuras.

Neste conteúdo, a proposta é bem direta:

- comparar como algumas coisas eram feitas no React 17
- mostrar como fazer no React 19 (quando existe comparação direta)
- apresentar hooks que ficaram mais relevantes no fluxo atual

---

## O que mudou de verdade no dia a dia?

Quando falamos em React 19, não é só uma troca de versão no `package.json`.

Em vários pontos, a API ficou mais expressiva para casos comuns de interface:

- formulários com menos boilerplate
- interações mais fluidas
- atualizações otimistas
- menos código de controle manual

Na prática, isso significa mais foco em regra de negócio e menos tempo montando estado auxiliar para controlar loading, erro e transição de UI.

---

## 1) Refs em componente: antes com `forwardRef`, agora com `ref` como prop

Esse é um exemplo simples, mas que mostra bem a direção da API.

No React 17, o caminho clássico para encaminhar uma `ref` era `forwardRef`.

### React 17

~~~tsx
import React, { forwardRef, useEffect, useRef } from "react";

type TextInputProps = React.ComponentProps<"input">;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(props, ref) {
    return <input {...props} ref={ref} />;
  },
);

export default function Example() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <TextInput ref={inputRef} placeholder="Digite aqui..." />;
}
~~~

No React 19, já podemos passar `ref` como prop no componente, deixando essa composição mais direta.

### React 19

~~~tsx
import React, { useEffect, useRef } from "react";

type TextInputProps = React.ComponentProps<"input"> & {
  ref?: React.Ref<HTMLInputElement>;
};

function TextInput({ ref, ...props }: TextInputProps) {
  return <input {...props} ref={ref} />;
}

export default function Example() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <TextInput ref={inputRef} placeholder="Digite aqui..." />;
}
~~~

É um detalhe que parece pequeno, mas reduz ruído em componente de base de design system.

Em termos de funcionamento, a ideia da `ref` continua a mesma nos dois casos: você cria com `useRef`, entrega para o componente de input e, depois da montagem, consegue acessar `inputRef.current` para disparar comportamentos como `focus()`.

A diferença é mais de ergonomia da API:

- no React 17, `forwardRef` era obrigatório para "encaminhar" a referência
- no React 19, `ref` entra como prop e o fluxo fica mais direto para leitura

Para times com muitos componentes reutilizáveis, essa redução de cerimônia ajuda bastante na manutenção.

Com a base de componentes mais limpa, o próximo passo é olhar para um problema que impacta direto a experiência: digitação travando em listas pesadas.

---

## 2) Busca com lista pesada: `useDeferredValue`

Esse é um hook ótimo para quando a digitação precisa continuar fluida, mesmo com render custoso de lista.

~~~tsx
import { Suspense, useDeferredValue, useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produto..."
      />

      <Suspense fallback={<p>Carregando resultados...</p>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
~~~

O comportamento esperado aqui é:

- input responde rápido
- resultado acompanha com pequeno atraso controlado
- experiência geral fica mais suave para o usuário

Detalhando o que acontece:

- `query` guarda o valor digitado em tempo real
- `deferredQuery` recebe esse valor de forma adiada quando há pressão de render
- o componente pesado (`SearchResults`) passa a reagir ao valor adiado, não ao valor imediato

Isso evita que cada tecla digitada bloqueie a interface inteira.

Um ponto importante: `useDeferredValue` não substitui debounce e não "economiza" request sozinho. Ele prioriza a responsividade da UI. Se seu caso precisar reduzir chamadas de rede, ainda vale combinar com debounce, cache ou controle de fetch.

Saindo de inputs e filtros, o mesmo princípio de fluidez aparece quando pensamos na tela inteira carregando por partes.

---

## 3) UI não bloqueante com `Suspense` em blocos independentes

Em telas de produto, dashboard e relatórios, nem tudo precisa carregar ao mesmo tempo.

Podemos quebrar a tela em partes e cada bloco renderiza quando estiver pronto.

~~~tsx
import { Suspense } from "react";

function ProductPage() {
  return (
    <div>
      <Header />
      <Price />

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </div>
  );
}
~~~

Isso evita travar a página inteira por causa de um único trecho mais lento.

No exemplo, existem dois boundaries de `Suspense`:

- um para recomendações
- outro para reviews

Se `Reviews` demorar mais, apenas essa parte mostra `ReviewsSkeleton`. O resto da tela continua visível e interativo.

Esse comportamento melhora bastante a percepção de performance, porque o usuário começa a usar a página antes de todos os blocos estarem prontos.

Em cenário de erro, vale combinar `Suspense` com Error Boundary. Assim você separa dois estados:

- carregando (fallback do `Suspense`)
- falha (fallback do Error Boundary)

Essa ideia de separar estados também fica muito forte na parte de formulário, que é onde o React 19 trouxe uma ergonomia bem interessante.

---

## 4) Formulários modernos com `useActionState`

No React 17, era comum gerenciar vários estados separados para submit:

- `isLoading`
- `error`
- mensagem de sucesso

No React 19, `useActionState` organiza esse fluxo de forma mais declarativa.

~~~tsx
import { useActionState } from "react";

type FormState = { error: string | null };

const initialState: FormState = { error: null };

async function submit(prevState: FormState, formData: FormData) {
  const email = formData.get("email");

  if (!email) {
    return { error: "Email obrigatório" };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { error: null };
}

export default function Form() {
  const [state, action, pending] = useActionState(submit, initialState);

  return (
    <form action={action}>
      <input name="email" placeholder="seu@email.com" />

      <button disabled={pending}>
        {pending ? "Enviando..." : "Enviar"}
      </button>

      {state.error && <p>{state.error}</p>}
    </form>
  );
}
~~~

O ganho prático aqui é clareza de fluxo com menos estado manual espalhado no componente.

No trecho `const [state, action, pending] = useActionState(submit, initialState)`:

- `state` é o estado retornado pela action, por exemplo `{ error: ... }`
- `action` é a função que você liga no `<form action={action}>`
- `pending` indica se a submissão atual ainda está em andamento

O `submit` recebe dois parâmetros:

- `prevState`: o estado anterior da action
- `formData`: os dados submetidos pelo formulário

No exemplo, se o email não existir, retornamos erro imediatamente. Se passar na validação, simulamos uma operação assíncrona e retornamos sucesso.

Se ocorrer erro real de API, uma abordagem comum é usar `try/catch` dentro da action e retornar um estado amigável para UI, por exemplo:

- `return { error: "Não foi possível enviar agora. Tente novamente." }`

Assim o usuário recebe feedback sem quebrar a experiência do formulário.

E se a gente quiser levar esse desacoplamento mais longe, dá para tirar o botão de submit do componente principal sem perder controle de estado.

---

## 5) Botão desacoplado com `useFormStatus`

Quando queremos quebrar o formulário em componentes menores, esse hook ajuda bastante.

~~~tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}

export default SubmitButton;
~~~

Assim, o botão conhece o status do form sem precisar receber `isLoading` por prop drilling.

No detalhe técnico, `useFormStatus` funciona lendo o contexto do formulário pai. Por isso ele costuma ficar em um componente filho renderizado dentro do `<form>`.

Quando a action inicia:

- `pending` vira `true`
- o botão pode desabilitar e trocar o texto

Quando termina:

- `pending` volta para `false`
- o componente volta ao estado normal

O ganho aqui é separação de responsabilidades: o formulário gerencia submissão e o botão só reage ao status.

Com a parte de submit organizada, vale avançar para outro tema importante de UX: feedback imediato em ações que dependem de API.

---

## 6) Atualização otimista com `useOptimistic`

Aqui entra um caso clássico de UX: comentários.

Em vez de esperar a resposta do servidor para só depois atualizar a tela, mostramos o resultado imediatamente.

~~~tsx
import { useOptimistic, useState } from "react";

type Comment = { id: number; text: string };

async function fakeApi() {
  await new Promise((resolve) => setTimeout(resolve, 800));
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, text: string) => [...state, { id: Date.now(), text }],
  );

  async function submit(formData: FormData) {
    const text = String(formData.get("comment") || "");
    if (!text.trim()) return;

    addOptimisticComment(text);
    await fakeApi();

    setComments((prev) => [...prev, { id: Date.now(), text }]);
  }

  return (
    <>
      <form action={submit}>
        <input name="comment" placeholder="Escreva um comentário..." />
        <button>Enviar</button>
      </form>

      {optimisticComments.map((comment) => (
        <p key={comment.id}>{comment.text}</p>
      ))}
    </>
  );
}
~~~

Esse padrão é muito útil em ações frequentes de interface, como comentar, favoritar e curtir.

Esse trecho é um dos mais legais para entender em profundidade.

No `useOptimistic(comments, updateFn)` passamos:

- `comments`: estado real, vindo do servidor ou da confirmação local
- `updateFn`: função que descreve como gerar a versão otimista da lista

No exemplo:

- o usuário envia comentário
- `addOptimisticComment(text)` insere imediatamente na UI
- a request ainda está em andamento
- quando a API confirma, atualizamos `comments` com `setComments`

Ou seja, o usuário enxerga resposta instantânea mesmo antes da confirmação do backend.

E se a API falhar?

No código atual, a chamada `fakeApi()` não trata erro, então em caso de falha você teria risco de divergência visual temporária. Em produção, o ideal é usar `try/catch`:

- no `try`, mantém fluxo atual
- no `catch`, reverte ou invalida a versão otimista
- opcionalmente exibe uma mensagem como "Não foi possível enviar o comentário"

Uma estratégia simples é manter um identificador temporário no item otimista e removê-lo se a operação falhar.

Depois de lidar com feedback instantâneo, o último ponto fecha bem o fluxo: como manter a interface responsiva quando a atualização em si é pesada.

---

## 7) Atualizações não urgentes com `useTransition`

Quando uma troca de aba ou filtro pode pesar na renderização, podemos marcar essa atualização como não urgente.

~~~tsx
import { useTransition } from "react";

function Tabs() {
  const [isPending, startTransition] = useTransition();

  function changeTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <button onClick={() => changeTab("overview")}>Overview</button>
      <button onClick={() => changeTab("analytics")}>Analytics</button>
      {isPending && <p>Atualizando aba...</p>}
    </>
  );
}
~~~

Isso ajuda a manter sensação de fluidez em dashboards, filtros e painéis com muito dado.

`useTransition` retorna:

- `isPending`: indica que a transição ainda está em processamento
- `startTransition`: marca um update como não urgente

No exemplo, o clique do botão é imediato, mas o `setTab` roda como atualização de baixa prioridade dentro de `startTransition`.

Na prática, isso ajuda quando trocar aba dispara render pesado. O React prioriza interações urgentes e processa a troca sem "engasgar" tanto a interface.

Se algo der erro durante a renderização da nova aba, o tratamento segue a estratégia normal da árvore React, geralmente com Error Boundary na área de conteúdo.

Com isso, fechamos um conjunto de ferramentas que, juntas, deixam o código mais declarativo e a interface mais estável para o usuário.

---

## 8) `use` para ler Promise no componente

Outro recurso relevante no React 19 é o `use`.

Na prática, ele permite ler o resultado de uma Promise diretamente durante a renderização do componente. Se a Promise ainda não resolveu, o React suspende aquela árvore e cai no `fallback` do `Suspense`.

~~~tsx
import { Suspense, use } from "react";

function UserDetails({ userPromise }: { userPromise: Promise<{ name: string }> }) {
  const user = use(userPromise);
  return <p>Usuário: {user.name}</p>;
}

export default function Page({
  userPromise,
}: {
  userPromise: Promise<{ name: string }>;
}) {
  return (
    <Suspense fallback={<p>Carregando usuário...</p>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
}
~~~

O ponto principal é que `use` trabalha junto com `Suspense`:

- Promise pendente -> mostra fallback
- Promise resolvida -> renderiza com dado
- Promise rejeitada -> cai no Error Boundary

Isso deixa o fluxo de leitura de dados mais direto em cenários onde o padrão de suspensão faz sentido.

Com isso, fica mais fácil entender como o React 19 aproxima "dados e UI" em um fluxo declarativo.

---

## 9) Actions como conceito (além dos hooks)

No post nós já usamos isso na prática com `useActionState`, mas vale explicitar a ideia: no React 19, Actions são funções assíncronas disparadas por interação do usuário, geralmente via formulário.

Em vez de montar toda a cola manual com `onSubmit`, `preventDefault`, estados de loading e parsing, você pode delegar isso para um fluxo orientado à action.

~~~tsx
async function saveProfile(formData: FormData) {
  const name = String(formData.get("name") || "");
  if (!name.trim()) {
    throw new Error("Nome é obrigatório");
  }

  await apiSave({ name });
}

export default function ProfileForm() {
  return (
    <form action={saveProfile}>
      <input name="name" />
      <button type="submit">Salvar</button>
    </form>
  );
}
~~~

No ecossistema React moderno, esse modelo costuma aparecer combinado com:

- `useActionState` para estado e feedback
- `useFormStatus` para status de submissão em componentes filhos
- `useOptimistic` para resposta visual imediata

Ou seja, não é só um hook novo. É uma forma nova de estruturar mutações de UI.

Com esse contexto, fica mais claro por que vários exemplos do React 19 parecem "menos imperativos" no código.

---

## 10) Performance de carregamento com `preload`, `preinit` e `preconnect`

Outro ponto que passa batido em muitos resumos é o suporte a APIs de carregamento antecipado no React DOM.

Essas APIs ajudam o navegador a se preparar antes de precisar de um recurso:

- `preconnect`: abre conexão com origem externa cedo
- `preload`: baixa recurso que você sabe que vai usar
- `preinit`: inicializa recursos como script e stylesheet de forma antecipada

Exemplo simplificado:

~~~tsx
import { preconnect, preload, preinit } from "react-dom";

preconnect("https://fonts.googleapis.com");
preload("/hero-banner.webp", { as: "image" });
preinit("https://cdn.exemplo.com/widget.js", { as: "script" });

export default function Hero() {
  return <img src="/hero-banner.webp" alt="Banner principal" />;
}
~~~

Isso não substitui estratégia de arquitetura, mas pode reduzir latência percebida em recursos críticos da página.

É o tipo de melhoria que, isoladamente, parece pequena, mas em conjunto com outras otimizações ajuda bastante no resultado final.

---

## 11) Melhor suporte a Custom Elements (Web Components)

Se você integra React com design systems externos ou bibliotecas baseadas em Web Components, esse tópico é importante.

No React 19, o suporte a Custom Elements ficou mais consistente, especialmente no tratamento de propriedades e eventos em elementos customizados.

Exemplo:

~~~tsx
export default function Checkout() {
  return (
    <payment-widget
      amount="199.90"
      currency="BRL"
      onpaymentapproved={(event: CustomEvent<{ transactionId: string }>) => {
        console.log("Pagamento aprovado:", event.detail.transactionId);
      }}
    />
  );
}
~~~

No mundo real, isso reduz fricção quando React precisa conviver com componentes vindos de outros ecossistemas.

Se o seu contexto envolve micro frontends ou bibliotecas de terceiros, vale testar esse cenário cedo.

---

## Conclusão

Saindo de uma base React 17 para olhar o React 19 com calma, fica bem claro que a evolução não está só em performance interna.

Existe também uma melhora real de ergonomia para quem escreve e mantém código:

- menos boilerplate
- fluxos mais declarativos
- APIs mais alinhadas com problemas reais de interface

Para mim, esse tipo de estudo é essencial porque nem sempre o contexto da empresa acompanha o ritmo das novas versões.

Então, além de conteúdo para o blog, este post também vira uma referência pessoal de atualização contínua.

Outro ponto que me chama atenção é como o React 19 parece cada vez mais alinhado ao cenário de SSR e streaming, principalmente com a evolução de `Suspense`, `use` e Actions. E isso conversa diretamente com o momento do mercado, já que o Next.js vem ganhando bastante força e puxando esse modelo para o dia a dia de muitos times.

Se você está nesse mesmo movimento de se atualizar aos poucos, espero que este guia te ajude a encurtar o caminho.

---

### Mais?

- React 19: <a href="https://react.dev/blog/2024/12/05/react-19" target="_blank">anúncio oficial</a>
- `useActionState`: <a href="https://react.dev/reference/react/useActionState" target="_blank">documentação</a>
- `useFormStatus`: <a href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank">documentação</a>
- `useOptimistic`: <a href="https://react.dev/reference/react/useOptimistic" target="_blank">documentação</a>
- `useTransition`: <a href="https://react.dev/reference/react/useTransition" target="_blank">documentação</a>
- `useDeferredValue`: <a href="https://react.dev/reference/react/useDeferredValue" target="_blank">documentação</a>
- `use`: <a href="https://react.dev/reference/react/use" target="_blank">documentação</a>
- `Suspense`: <a href="https://react.dev/reference/react/Suspense" target="_blank">documentação</a>
- Actions: <a href="https://react.dev/blog/2024/12/05/react-19#actions" target="_blank">visão geral</a>
- `preload`, `preinit`, `preconnect`: <a href="https://react.dev/reference/react-dom" target="_blank">react-dom APIs</a>
- Custom Elements: <a href="https://react.dev/blog/2024/12/05/react-19#support-for-custom-elements" target="_blank">nota oficial</a>

- Quer trocar ideia sobre migração e atualização no ecossistema React? Me manda <a href="/#contact" target="_blank">uma mensagem</a>.
