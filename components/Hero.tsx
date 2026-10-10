"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({ subsets: ["latin"], display: "swap" });

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "Editorials", href: "#editorials" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const stats = [
  { value: "12+", label: "Seasons" },
  { value: "80", label: "Editorials" },
  { value: "24", label: "Brand partners" },
];

// Replace these with your own photography (local /public files or a CDN).
const images = {
  main: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
  detail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
};

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className={`${sans.className} relative min-h-[100svh] overflow-hidden bg-[#f6f1eb] text-stone-900`}
    >
      {/* Soft background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl"
      />

      {/* Navigation */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className={`${serif.className} text-2xl tracking-wide sm:text-3xl`}
        >
          Élise <span className="italic text-rose-800">Marlowe</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.25em] text-stone-600 transition-colors hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-30 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-stone-900 transition-transform duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-stone-900 transition-transform duration-300 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-[#f6f1eb] transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`${serif.className} text-4xl italic`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-0 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-6 sm:px-8 md:pt-10 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-24">
        {/* Copy */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-rose-800">
            <span className="h-px w-10 bg-rose-800" />
            Fashion Stylist &amp; Creative Director
          </p>

          <h1
            className={`${serif.className} text-[3.25rem] font-light leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem] xl:text-8xl`}
          >
            Dressing women
            <br />
            in <span className="italic text-rose-800">quiet</span>
            <br />
            confidence.
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-stone-600 sm:text-lg">
            A portfolio of editorial styling, runway looks and personal
            wardrobes — built on timeless silhouettes, considered textures and
            the woman who wears them.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#collections"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#f6f1eb] transition-colors hover:bg-rose-900"
            >
              View Portfolio
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-stone-900/20 px-8 py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:border-stone-900"
            >
              Book a Consultation
            </Link>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-stone-900/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd
                  className={`${serif.className} text-3xl font-light sm:text-4xl`}
                >
                  {s.value}
                </dd>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        {/* Imagery */}
        <div className="relative order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:ml-auto lg:mr-0">
            {/* Main image with arched top */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-stone-200 shadow-2xl shadow-stone-900/10">
              <Image
                src={images.main}
                alt="Model in a flowing neutral-toned outfit from the latest collection"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 32rem, 90vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Overlapping detail image */}
            <div className="absolute -bottom-8 -left-4 w-32 overflow-hidden rounded-xl border-4 border-[#f6f1eb] shadow-xl sm:-left-10 sm:w-44 lg:-left-16 lg:w-52">
              <div className="relative aspect-[3/4]">
                <Image
                  src={images.detail}
                  alt="Close-up styling detail"
                  fill
                  sizes="(min-width: 1024px) 13rem, (min-width: 640px) 11rem, 8rem"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-2 top-10 rounded-full bg-white/80 px-5 py-3 shadow-lg backdrop-blur sm:-right-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
                Now showing
              </p>
              <p className={`${serif.className} text-lg italic`}>
                Autumn / Winter ’26
              </p>
            </div>

            {/* Vertical caption (desktop) */}
            <p className="absolute -right-10 bottom-16 hidden origin-bottom-right rotate-90 text-[10px] uppercase tracking-[0.4em] text-stone-400 xl:block">
              Paris · Milan · Mumbai
            </p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-400 lg:flex">
        Scroll
        <span className="h-10 w-px animate-pulse bg-stone-400" />
      </div>
    </section>
  );
}
