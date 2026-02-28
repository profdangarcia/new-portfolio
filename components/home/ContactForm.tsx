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

  const buttonBg =
    status === "success"
      ? "#25D366"
      : status === "error"
        ? "#db4437"
        : status === "loading"
          ? "#000"
          : "transparent";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-[0.9375rem] flex max-w-[50rem] flex-wrap items-center justify-center"
    >
      <div className="flex w-full flex-col items-center md:max-w-[46%] md:mr-[8%]">
        <input
          id="name"
          type="text"
          placeholder={data.name.placeholder}
          disabled={status === "loading"}
          {...register("name")}
          className={`mt-[0.9375rem] w-full rounded-[0.25rem] border-b bg-transparent px-[0.9375rem] font-sans text-[#777] transition-all duration-500 focus:outline-none lg:text-[0.875rem] ${
            errors.name
              ? "border border-[#ff3d3d] border-b-[#ff3d3d] focus:border-[#ff3d3d]"
              : "border-0 border-b border-[#dfdfdf] focus:border focus:border-[#333] focus:border-b-[#333]"
          }`}
          style={{ height: "2.8125rem", fontSize: "0.8125rem" }}
        />
        <div className="relative mt-[0.3125rem] flex h-[1.5625rem] w-full items-center justify-center overflow-hidden">
          <span
            className={`absolute text-center text-[#ff3d3d] transition-all duration-500 ease-in-out ${
              errors.name ? "translate-y-0" : "translate-y-2.5"
            }`}
            style={{ fontSize: "0.8125rem" }}
          >
            {errors.name?.message ?? ""}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-center md:max-w-[46%]">
        <input
          id="email"
          type="email"
          placeholder={data.email.placeholder}
          disabled={status === "loading"}
          {...register("email")}
          className={`mt-[0.9375rem] w-full rounded-[0.25rem] border-b bg-transparent px-[0.9375rem] font-sans text-[#777] transition-all duration-500 focus:outline-none lg:text-[0.875rem] ${
            errors.email
              ? "border border-[#ff3d3d] border-b-[#ff3d3d] focus:border-[#ff3d3d]"
              : "border-0 border-b border-[#dfdfdf] focus:border focus:border-[#333] focus:border-b-[#333]"
          }`}
          style={{ height: "2.8125rem", fontSize: "0.8125rem" }}
        />
        <div className="relative mt-[0.3125rem] flex h-[1.5625rem] w-full items-center justify-center overflow-hidden">
          <span
            className={`absolute text-center text-[#ff3d3d] transition-all duration-500 ease-in-out ${
              errors.email ? "translate-y-0" : "translate-y-2.5"
            }`}
            style={{ fontSize: "0.8125rem" }}
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
          className={`mt-[0.9375rem] w-full resize-y rounded-[0.25rem] border-b bg-transparent pt-[0.9375rem] pl-[0.9375rem] font-sans text-[#777] transition-all duration-500 focus:outline-none lg:text-[0.875rem] ${
            errors.message
              ? "border border-[#ff3d3d] border-b-[#ff3d3d] focus:border-[#ff3d3d]"
              : "border-0 border-b border-[#dfdfdf] focus:border focus:border-[#333] focus:border-b-[#333]"
          }`}
          style={{ fontSize: "0.8125rem" }}
        />
        <div className="relative mt-[0.3125rem] flex h-[1.5625rem] w-full items-center justify-center overflow-hidden">
          <span
            className={`absolute text-center text-[#ff3d3d] transition-all duration-500 ease-in-out ${
              errors.message ? "translate-y-0" : "translate-y-2.5"
            }`}
            style={{ fontSize: "0.8125rem" }}
          >
            {errors.message?.message ?? ""}
          </span>
        </div>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="relative mt-[1.875rem] flex h-10 w-[13.4375rem] items-center justify-center rounded-[3.125rem] font-semibold transition-all duration-300 ease-in-out hover:text-white focus:outline-none"
        style={{
          fontFamily: "Montserrat, sans-serif",
          color: status === "form" ? "#333" : "#fff",
          background: buttonBg,
          border: "2px solid rgb(0, 0, 0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.background =
            status === "form" ? "#000" : buttonBg;
        }}
        onMouseLeave={(e) => {
          if (status === "form") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#333";
          } else {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = buttonBg;
          }
        }}
      >
        {status === "loading" ? <Loader /> : buttonLabel}
      </button>
    </form>
  );
}
