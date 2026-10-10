import type { Metadata } from "next";
import Link from "next/link";
import RegistrationForm from "../../components/RegistrationForm";
import { sans, serif } from "../../components/collection/fonts";

export const metadata: Metadata = {
  title: "Register — Élise Marlowe",
  description: "Register your interest in our styling services.",
};

export default function RegisterPage() {
  return (
    <main className={`${sans.className} relative min-h-[100svh] overflow-hidden bg-[#f6f1eb] text-stone-900`}>
      {/* Soft background accents, as on the homepage */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl"
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link href="/" className={`${serif.className} text-2xl tracking-wide sm:text-3xl`}>
          Élise <span className="italic text-rose-800">Marlowe</span>
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 transition-colors hover:text-stone-900"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back to site
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-6 sm:px-8 sm:pb-24 md:pt-10 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:pb-32">
        <div className="lg:col-span-5 lg:pt-6">
          <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-rose-800">
            <span className="h-px w-10 bg-rose-800" />
            Register
          </p>
          <h1
            className={`${serif.className} text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl`}
          >
            Begin your
            <br />
            <span className="italic text-rose-800">story</span> with us.
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-stone-600">
            Tell us a little about yourself and what you have in mind. Choose the plan that feels
            closest to your needs — we’ll review your registration and get back to you.
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-stone-500">
            Registering is free and doesn’t commit you to anything. No payment is taken here.
          </p>
        </div>

        <div className="lg:col-span-7">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
