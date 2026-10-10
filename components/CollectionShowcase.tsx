"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CategoryCard from "./collection/CategoryCard";
import LookCard from "./collection/LookCard";
import { categories, looks } from "./collection/collectionData";
import { sans, serif } from "./collection/fonts";

const ALL = "all";
const HASH_PREFIX = "#collection-";

export default function CollectionShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const lookbookRef = useRef<HTMLDivElement>(null);

  const visibleLooks =
    activeCategory === ALL
      ? looks
      : looks.filter((look) => look.category === activeCategory);

  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? "";

  const lookCount = (slug: string) =>
    looks.filter((look) => look.category === slug).length;

  const scrollToLookbook = () => {
    lookbookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Show one category's looks, update the URL (so the link can be shared),
  // and scroll down to the lookbook.
  const selectCategory = useCallback((slug: string, scroll = true) => {
    setActiveCategory(slug);
    const hash = slug === ALL ? "#lookbook" : `${HASH_PREFIX}${slug}`;
    window.history.replaceState(null, "", hash);
    if (scroll) scrollToLookbook();
  }, []);

  // Support links like /#collection-jeans (when the page loads, or when the
  // hash changes from somewhere else on the page).
  useEffect(() => {
    const applyHash = () => {
      const { hash } = window.location;
      if (!hash.startsWith(HASH_PREFIX)) return;
      const slug = hash.slice(HASH_PREFIX.length);
      if (categories.some((c) => c.slug === slug)) {
        setActiveCategory(slug);
        scrollToLookbook();
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const filters = [{ slug: ALL, name: "All" }, ...categories];

  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className={`${sans.className} relative scroll-mt-4 bg-[#f6f1eb] text-stone-900`}
    >
      {/* Thin divider that echoes the hero */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="h-px w-full bg-stone-900/10" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        {/* ---------- Heading ---------- */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-rose-800">
              <span className="h-px w-10 bg-rose-800" />
              The Collections
            </p>
            <h2
              id="collections-heading"
              className={`${serif.className} text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl`}
            >
              Curated for every
              <br />
              <span className="italic text-rose-800">chapter</span> of her
              wardrobe.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-stone-600">
              From hand-embroidered lehengas to the perfect pair of jeans —
              five edits, styled with the same eye for silhouette, colour and
              texture.
            </p>
            <a
              href="#lookbook"
              onClick={(event) => {
                event.preventDefault();
                selectCategory(ALL);
              }}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-stone-900 px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#f6f1eb] transition-colors hover:bg-rose-900"
            >
              Explore Collection
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </div>

        {/* ---------- Category grid ---------- */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={index}
              lookCount={lookCount(category.slug)}
              featured={index === 0}
              onSelect={selectCategory}
            />
          ))}
        </div>

        {/* ---------- Lookbook (filtered collection) ---------- */}
        <div
          id="lookbook"
          ref={lookbookRef}
          className="scroll-mt-6 pt-24 sm:pt-32"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
                The Lookbook
              </p>
              <h3
                className={`${serif.className} mt-3 whitespace-nowrap text-4xl font-light leading-none sm:text-5xl`}
                aria-live="polite"
              >
                {activeCategory === ALL ? (
                  "All looks"
                ) : (
                  <span className="italic">{categoryName(activeCategory)}</span>
                )}
              </h3>
            </div>

            {/* Filter pills — scroll sideways on small screens */}
            <div
              role="group"
              aria-label="Filter looks by category"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {filters.map((filter) => {
                const isActive = activeCategory === filter.slug;
                return (
                  <button
                    key={filter.slug}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectCategory(filter.slug, false)}
                    className={`shrink-0 rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      isActive
                        ? "border-stone-900 bg-stone-900 text-[#f6f1eb]"
                        : "border-stone-900/15 text-stone-600 hover:border-stone-900 hover:text-stone-900"
                    }`}
                  >
                    {filter.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* `key` re-mounts the grid on filter change so it fades in */}
          <div
            key={activeCategory}
            className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 motion-safe:animate-[collection-fade_0.6s_ease-out] sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleLooks.map((look) => (
              <LookCard
                key={look.id}
                look={look}
                categoryName={categoryName(look.category)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
