"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "./Loader";

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

interface ContactFormProps {
  data: {
    error: string;
    success: string;
    default: string;
    name: { placeholder: string; error: string };
    email: { placeholder: string; error: string; errorInvalid: string };
    message: { placeholder: string; error: string };
  };
}

export default function ContactForm({ data }: ContactFormProps) {
  const schema = z.object({
    name: z.string().min(1, data.name.error),
    email: z
      .string()
      .min(1, data.email.error)
      .email(data.email.errorInvalid),
    message: z.string().min(1, data.message.error),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const [status, setStatus] = useState<"form" | "loading" | "error" | "success">("form");

  async function onSubmit(payload: ContactFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("form"), 2500);
  }

  const buttonLabel =
    status === "form"
      ? data.default
      : status === "loading"
        ? null
        : status === "success"
          ? data.success
          : data.error;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-lg flex-col gap-4"
    >
      <div>
        <input
          id="name"
          type="text"
          placeholder={data.name.placeholder}
          disabled={status === "loading"}
          {...register("name")}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 dark:bg-[var(--background)] ${
            errors.name
              ? "border-[var(--error)] focus:ring-[var(--error)]"
              : "border-[var(--text)]/20 focus:ring-[var(--text-title)]"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.name.message}</p>
        )}
      </div>
      <div>
        <input
          id="email"
          type="email"
          placeholder={data.email.placeholder}
          disabled={status === "loading"}
          {...register("email")}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 dark:bg-[var(--background)] ${
            errors.email
              ? "border-[var(--error)] focus:ring-[var(--error)]"
              : "border-[var(--text)]/20 focus:ring-[var(--text-title)]"
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.email.message}</p>
        )}
      </div>
      <div>
        <textarea
          id="message"
          rows={6}
          placeholder={data.message.placeholder}
          disabled={status === "loading"}
          {...register("message")}
          className={`w-full resize-y rounded-lg border bg-white px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 dark:bg-[var(--background)] ${
            errors.message
              ? "border-[var(--error)] focus:ring-[var(--error)]"
              : "border-[var(--text)]/20 focus:ring-[var(--text-title)]"
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[var(--text-title)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {status === "loading" ? <Loader /> : buttonLabel}
      </button>
    </form>
  );
}
