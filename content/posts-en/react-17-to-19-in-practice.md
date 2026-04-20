---
id: 7
title: "React 17 to 19 in practice: real comparisons and new hooks"
description: "See practical examples of how we used to do things in React 17 and how we can do them in React 19, with focus on forms, performance, and user experience"
image: "/posts/en/post7-thumb.png"
author: "Daniel Garcia"
date: "20 Apr. 2026"
---

If you work with React day to day, this may sound familiar: at work, projects are often on older versions because of legacy constraints, deadlines, or priorities, while the ecosystem keeps moving forward.

This post came exactly from that scenario.

Besides sharing content, I also use this blog as study and update material. We do not always have room to explore the latest versions in real company projects, so turning this study into a post is a practical way to learn better and keep references organized for future use.

In this article, the plan is very direct:

- compare how some things were done in React 17
- show how to do them in React 19 (when there is a direct comparison)
- cover hooks that became more relevant in the current flow

---

## What really changed in day-to-day work?

When we talk about React 19, it is not only a version bump in `package.json`.

In several areas, the API became more expressive for common UI cases:

- forms with less boilerplate
- smoother interactions
- optimistic updates
- less manual control code

In practice, this means more focus on business rules and less time creating helper state just to control loading, errors, and UI transitions.

---

## 1) Refs in components: before with `forwardRef`, now with `ref` as prop

This is a simple example, but it shows the API direction very clearly.

In React 17, the classic way to forward a `ref` was `forwardRef`.

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

  return <TextInput ref={inputRef} placeholder="Type here..." />;
}
~~~

In React 19, we can pass `ref` as a prop directly, which makes composition cleaner.

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

  return <TextInput ref={inputRef} placeholder="Type here..." />;
}
~~~

It looks small, but it reduces noise in base components of a design system.

In terms of behavior, the ref idea is the same in both cases: you create it with `useRef`, pass it to the input component, and after mount you can access `inputRef.current` to trigger things like `focus()`.

The difference is mostly API ergonomics:

- in React 17, `forwardRef` was required to forward the reference
- in React 19, `ref` comes in as a prop and the flow is easier to read

For teams with many reusable components, this reduction in ceremony helps maintenance a lot.

With cleaner base components, the next step is a problem that directly impacts UX: typing lag in heavy lists.

---

## 2) Search with heavy list: `useDeferredValue`

This hook is great when typing must stay smooth, even with expensive list rendering.

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
        placeholder="Search product..."
      />

      <Suspense fallback={<p>Loading results...</p>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
~~~

Expected behavior here:

- input stays responsive
- results follow with a controlled delay
- the overall experience feels smoother

What happens under the hood:

- `query` stores what the user types in real time
- `deferredQuery` receives that value later when there is render pressure
- the heavy component (`SearchResults`) reacts to the deferred value, not the immediate one

This prevents every keystroke from blocking the entire interface.

Important note: `useDeferredValue` does not replace debounce and does not reduce network requests by itself. It prioritizes UI responsiveness. If your case needs fewer API calls, combine it with debounce, cache, or fetch control.

Moving from inputs and filters, the same fluidity principle appears when we think about full-page loading in parts.

---

## 3) Non-blocking UI with `Suspense` in independent blocks

In product pages, dashboards, and reports, not everything needs to load at once.

You can split the page into sections and let each block render when ready.

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

This avoids freezing the whole page because one section is slower.

In this example there are two `Suspense` boundaries:

- one for recommendations
- one for reviews

If `Reviews` takes longer, only that section shows `ReviewsSkeleton`. The rest of the page stays visible and interactive.

This improves perceived performance a lot because users can start using the page before every block is ready.

For error scenarios, it is worth combining `Suspense` with an Error Boundary. That separates two states:

- loading (`Suspense` fallback)
- failure (Error Boundary fallback)

This same idea of separating states becomes very strong in forms, where React 19 brought a very good ergonomics improvement.

---

## 4) Modern forms with `useActionState`

In React 17, it was common to manage multiple submit states manually:

- `isLoading`
- `error`
- success message

In React 19, `useActionState` organizes this flow in a more declarative way.

~~~tsx
import { useActionState } from "react";

type FormState = { error: string | null };

const initialState: FormState = { error: null };

async function submit(prevState: FormState, formData: FormData) {
  const email = formData.get("email");

  if (!email) {
    return { error: "Email is required" };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { error: null };
}

export default function Form() {
  const [state, action, pending] = useActionState(submit, initialState);

  return (
    <form action={action}>
      <input name="email" placeholder="you@email.com" />

      <button disabled={pending}>
        {pending ? "Sending..." : "Send"}
      </button>

      {state.error && <p>{state.error}</p>}
    </form>
  );
}
~~~

The practical gain is flow clarity with less manual state spread across the component.

In `const [state, action, pending] = useActionState(submit, initialState)`:

- `state` is the state returned by the action, for example `{ error: ... }`
- `action` is the function linked in `<form action={action}>`
- `pending` indicates whether the current submission is still running

`submit` receives two parameters:

- `prevState`: previous action state
- `formData`: submitted form data

In the example, if email is missing, it returns an error immediately. If validation passes, it simulates an async operation and returns success.

If a real API error happens, a common approach is to use `try/catch` inside the action and return a UI-friendly state, for example:

- `return { error: "Could not send right now. Please try again." }`

This gives feedback without breaking the form experience.

If you want to push this decoupling further, you can move the submit button to a child component and still keep state control.

---

## 5) Decoupled submit button with `useFormStatus`

When you split forms into smaller components, this hook helps a lot.

~~~tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export default SubmitButton;
~~~

This way, the button knows form status without receiving `isLoading` through prop drilling.

Technically, `useFormStatus` reads context from the parent form. That is why it usually lives in a child component rendered inside `<form>`.

When action starts:

- `pending` becomes `true`
- button can disable and change label

When action finishes:

- `pending` returns to `false`
- component returns to normal state

The gain is clear separation of responsibilities: form handles submission and button reacts to status.

With submit flow organized, it is worth moving to another important UX topic: immediate feedback for API-dependent actions.

---

## 6) Optimistic updates with `useOptimistic`

Here is a classic UX case: comments.

Instead of waiting for the server response and only then updating UI, we show the result immediately.

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
        <input name="comment" placeholder="Write a comment..." />
        <button>Send</button>
      </form>

      {optimisticComments.map((comment) => (
        <p key={comment.id}>{comment.text}</p>
      ))}
    </>
  );
}
~~~

This pattern is very useful for frequent UI actions, like comments, likes, and favorites.

This is one of the most interesting snippets to understand deeply.

In `useOptimistic(comments, updateFn)` we pass:

- `comments`: real state, from server or confirmed local update
- `updateFn`: function that describes how to generate the optimistic version

In the example:

- user submits comment
- `addOptimisticComment(text)` inserts it immediately in UI
- request is still running
- when API confirms, we update `comments` with `setComments`

So users see instant feedback even before backend confirmation.

What if API fails?

In current code, `fakeApi()` has no error handling, so failure can create temporary visual divergence. In production, use `try/catch`:

- in `try`, keep current flow
- in `catch`, rollback or invalidate optimistic version
- optionally show message like "Could not send comment"

A simple strategy is to keep a temporary identifier on optimistic items and remove it if operation fails.

After immediate feedback, the last point closes the flow well: keeping UI responsive when the update itself is heavy.

---

## 7) Non-urgent updates with `useTransition`

When switching tabs or filters can make rendering heavy, you can mark that update as non-urgent.

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
      {isPending && <p>Updating tab...</p>}
    </>
  );
}
~~~

This helps keep dashboards and filter-heavy screens feeling smooth.

`useTransition` returns:

- `isPending`: indicates transition is still processing
- `startTransition`: marks an update as non-urgent

In the example, click feedback is immediate, but `setTab` runs as low-priority update inside `startTransition`.

In practice, this helps when tab switches trigger heavy render. React prioritizes urgent interactions and processes the tab change with less jank.

If rendering the new tab throws an error, handling follows normal tree strategy, usually with an Error Boundary around the content area.

With that, we close a set of tools that together make code more declarative and UI more stable.

---

## 8) `use` to read Promise in a component

Another relevant React 19 feature is `use`.

In practice, it lets you read a Promise result directly during component render. If Promise is still pending, React suspends that subtree and falls back to `Suspense`.

~~~tsx
import { Suspense, use } from "react";

function UserDetails({ userPromise }: { userPromise: Promise<{ name: string }> }) {
  const user = use(userPromise);
  return <p>User: {user.name}</p>;
}

export default function Page({
  userPromise,
}: {
  userPromise: Promise<{ name: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
}
~~~

Main point: `use` works together with `Suspense`:

- pending Promise -> shows fallback
- resolved Promise -> renders data
- rejected Promise -> goes to Error Boundary

That makes data reading flow more direct in scenarios where suspension pattern fits well.

This helps explain how React 19 brings data and UI closer in a declarative flow.

---

## 9) Actions as a concept (beyond hooks)

In this post we already use this with `useActionState`, but it is worth making the concept explicit: in React 19, Actions are async functions triggered by user interactions, often through forms.

Instead of manually wiring `onSubmit`, `preventDefault`, loading states, and parsing, you can delegate this flow to an action-oriented model.

~~~tsx
async function saveProfile(formData: FormData) {
  const name = String(formData.get("name") || "");
  if (!name.trim()) {
    throw new Error("Name is required");
  }

  await apiSave({ name });
}

export default function ProfileForm() {
  return (
    <form action={saveProfile}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
~~~

In modern React ecosystem, this model is often combined with:

- `useActionState` for state and feedback
- `useFormStatus` for submit status in child components
- `useOptimistic` for immediate visual response

So it is not only a new hook. It is a new way to structure UI mutations.

With that context, it becomes clearer why many React 19 examples feel less imperative.

---

## 10) Loading performance with `preload`, `preinit`, and `preconnect`

Another point often missed in summaries is support for early-loading APIs in React DOM.

These APIs help the browser prepare before a resource is actually needed:

- `preconnect`: opens connection to external origin early
- `preload`: downloads a resource you know will be used
- `preinit`: initializes resources like scripts and stylesheets in advance

Simplified example:

~~~tsx
import { preconnect, preload, preinit } from "react-dom";

preconnect("https://fonts.googleapis.com");
preload("/hero-banner.webp", { as: "image" });
preinit("https://cdn.example.com/widget.js", { as: "script" });

export default function Hero() {
  return <img src="/hero-banner.webp" alt="Main banner" />;
}
~~~

This does not replace architecture strategy, but it can reduce perceived latency for critical page resources.

This kind of improvement can look small in isolation, but combined with other optimizations it adds up quickly.

---

## 11) Better support for Custom Elements (Web Components)

If you integrate React with external design systems or Web Components-based libraries, this topic matters.

In React 19, Custom Elements support became more consistent, especially around properties and events in custom elements.

Example:

~~~tsx
export default function Checkout() {
  return (
    <payment-widget
      amount="199.90"
      currency="BRL"
      onpaymentapproved={(event: CustomEvent<{ transactionId: string }>) => {
        console.log("Payment approved:", event.detail.transactionId);
      }}
    />
  );
}
~~~

In real-world projects, this reduces friction when React needs to coexist with components from other ecosystems.

If your context includes micro frontends or third-party component libraries, this scenario is worth testing early.

---

## Conclusion

Coming from a React 17 baseline and looking at React 19 with care, it is clear that evolution is not only internal performance.

There is also a real ergonomics improvement for people writing and maintaining code:

- less boilerplate
- more declarative flows
- APIs more aligned with real UI problems

For me, this kind of study is essential because company context does not always move at the same pace as new versions.

So besides blog content, this post also becomes a personal reference for continuous updates.

Another point that stands out to me is how React 19 seems increasingly aligned with SSR and streaming scenarios, mainly with the evolution of `Suspense`, `use`, and Actions. And this connects directly with the market moment, since Next.js keeps growing and pulling this model into many teams' day-to-day work.

If you are in that same process of updating step by step, I hope this guide helps shorten the path.

---

### More?

- React 19: <a href="https://react.dev/blog/2024/12/05/react-19" target="_blank">official announcement</a>
- `useActionState`: <a href="https://react.dev/reference/react/useActionState" target="_blank">docs</a>
- `useFormStatus`: <a href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank">docs</a>
- `useOptimistic`: <a href="https://react.dev/reference/react/useOptimistic" target="_blank">docs</a>
- `useTransition`: <a href="https://react.dev/reference/react/useTransition" target="_blank">docs</a>
- `useDeferredValue`: <a href="https://react.dev/reference/react/useDeferredValue" target="_blank">docs</a>
- `use`: <a href="https://react.dev/reference/react/use" target="_blank">docs</a>
- `Suspense`: <a href="https://react.dev/reference/react/Suspense" target="_blank">docs</a>
- Actions: <a href="https://react.dev/blog/2024/12/05/react-19#actions" target="_blank">overview</a>
- `preload`, `preinit`, `preconnect`: <a href="https://react.dev/reference/react-dom" target="_blank">react-dom APIs</a>
- Custom Elements: <a href="https://react.dev/blog/2024/12/05/react-19#support-for-custom-elements" target="_blank">official note</a>

- Want to chat about migration and updates in the React ecosystem? Send me <a href="/#contact" target="_blank">a message</a>.
