"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "@/components/Loader";

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

  const isPrimaryButton = status === "form";
  const errorBg = "var(--error)";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-6 flex max-w-[50rem] flex-wrap items-center justify-center gap-x-8"
    >
      <div className="flex w-full flex-col md:max-w-[46%]">
        <input
          id="name"
          type="text"
          placeholder={data.name.placeholder}
          disabled={status === "loading"}
          {...register("name")}
          className={`focus-ring mt-4 w-full rounded-lg border bg-[var(--surface)] px-4 py-3 text-[var(--text)] transition-colors placeholder:text-[var(--text-muted)] ${
            errors.name
              ? "border-[var(--error)] focus:border-[var(--error)] focus:outline-[var(--error)]"
              : "border-[var(--border)] focus:border-[var(--primary)] focus:outline-[var(--primary)]"
          }`}
          style={{ fontSize: "0.9375rem" }}
        />
        <div className="relative mt-1 flex h-6 w-full items-center overflow-hidden">
          <span
            className={`absolute text-sm text-[var(--error)] transition-transform duration-200 ${
              errors.name ? "translate-y-0" : "translate-y-4"
            }`}
          >
            {errors.name?.message ?? ""}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col md:max-w-[46%]">
        <input
          id="email"
          type="email"
          placeholder={data.email.placeholder}
          disabled={status === "loading"}
          {...register("email")}
          className={`focus-ring mt-4 w-full rounded-lg border bg-[var(--surface)] px-4 py-3 text-[var(--text)] transition-colors placeholder:text-[var(--text-muted)] ${
            errors.email
              ? "border-[var(--error)] focus:border-[var(--error)]"
              : "border-[var(--border)] focus:border-[var(--primary)] focus:outline-[var(--primary)]"
          }`}
          style={{ fontSize: "0.9375rem" }}
        />
        <div className="relative mt-1 flex h-6 w-full items-center overflow-hidden">
          <span
            className={`absolute text-sm text-[var(--error)] transition-transform duration-200 ${
              errors.email ? "translate-y-0" : "translate-y-4"
            }`}
          >
            {errors.email?.message ?? ""}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <textarea
          id="message"
          rows={8}
          placeholder={data.message.placeholder}
          disabled={status === "loading"}
          {...register("message")}
          className={`focus-ring mt-4 w-full resize-y rounded-lg border bg-[var(--surface)] px-4 py-3 pt-4 text-[var(--text)] transition-colors placeholder:text-[var(--text-muted)] ${
            errors.message
              ? "border-[var(--error)] focus:border-[var(--error)]"
              : "border-[var(--border)] focus:border-[var(--primary)] focus:outline-[var(--primary)]"
          }`}
          style={{ fontSize: "0.9375rem" }}
        />
        <div className="relative mt-1 flex h-6 w-full items-center overflow-hidden">
          <span
            className={`absolute text-sm text-[var(--error)] transition-transform duration-200 ${
              errors.message ? "translate-y-0" : "translate-y-4"
            }`}
          >
            {errors.message?.message ?? ""}
          </span>
        </div>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-interact focus-ring relative mt-8 flex h-12 min-w-[13.4375rem] items-center justify-center rounded-full px-8 font-semibold text-white transition-all duration-300 focus:outline-none disabled:pointer-events-none"
        style={{
          fontFamily: "Montserrat, sans-serif",
          background:
            status === "form"
              ? "var(--primary)"
              : status === "success"
                ? "#25D366"
                : status === "error"
                  ? errorBg
                  : "var(--text-title)",
        }}
        onMouseEnter={(e) => {
          if (status === "form") {
            e.currentTarget.style.background = "var(--primary-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (status === "form") {
            e.currentTarget.style.background = "var(--primary)";
          }
        }}
      >
        {status === "loading" ? <Loader /> : buttonLabel}
      </button>
    </form>
  );
}
