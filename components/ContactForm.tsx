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
      className="mx-auto mt-4 flex max-w-[50rem] flex-wrap items-center justify-center"
    >
      <div className="flex w-full flex-col items-center md:max-w-[46%] md:mr-[8%]">
        <input
          id="name"
          type="text"
          placeholder={data.name.placeholder}
          disabled={status === "loading"}
          {...register("name")}
          className={`mt-4 w-full rounded px-4 font-sans text-[var(--text)] text-[0.8125rem] transition-colors duration-500 focus:outline-none md:text-[0.875rem] ${
            errors.name ? "border border-[var(--error)] border-b-[var(--error)]" : "border-0 border-b border-[#dfdfdf]"
          }`}
          style={{ height: "2.8125rem" }}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.name.message}</p>
        )}
      </div>
      <div className="flex w-full flex-col items-center md:max-w-[46%]">
        <input
          id="email"
          type="email"
          placeholder={data.email.placeholder}
          disabled={status === "loading"}
          {...register("email")}
          className={`mt-4 w-full rounded px-4 font-sans text-[var(--text)] text-[0.8125rem] transition-colors duration-500 focus:outline-none md:text-[0.875rem] ${
            errors.email ? "border border-[var(--error)] border-b-[var(--error)]" : "border-0 border-b border-[#dfdfdf]"
          }`}
          style={{ height: "2.8125rem" }}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.email.message}</p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <textarea
          id="message"
          rows={6}
          placeholder={data.message.placeholder}
          disabled={status === "loading"}
          {...register("message")}
          className={`mt-4 w-full resize-y rounded pt-4 pl-4 font-sans text-[var(--text)] text-[0.8125rem] transition-colors duration-500 focus:outline-none md:text-[0.875rem] ${
            errors.message ? "border border-[var(--error)] border-b-[var(--error)]" : "border-0 border-b border-[#dfdfdf]"
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="relative mt-8 flex h-10 w-[13.4375rem] items-center justify-center rounded-[3.125rem] border-2 border-black font-semibold transition-all duration-300 ease-in-out hover:text-white"
        style={{
          fontFamily: "Montserrat, sans-serif",
          color: status === "form" ? "var(--text-title)" : "#fff",
          background:
            status === "success"
              ? "#25D366"
              : status === "error"
                ? "#db4437"
                : status === "loading"
                  ? "#000"
                  : "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          if (status === "form") e.currentTarget.style.background = "#000";
          else if (status === "success") e.currentTarget.style.background = "#25D366";
          else if (status === "error") e.currentTarget.style.background = "#db4437";
          else e.currentTarget.style.background = "#000";
        }}
        onMouseLeave={(e) => {
          if (status === "form") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-title)";
          } else {
            e.currentTarget.style.color = "#fff";
            if (status === "success") e.currentTarget.style.background = "#25D366";
            else if (status === "error") e.currentTarget.style.background = "#db4437";
            else e.currentTarget.style.background = "#000";
          }
        }}
      >
        {status === "loading" ? <Loader /> : buttonLabel}
      </button>
    </form>
  );
}
