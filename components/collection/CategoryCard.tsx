import type { MouseEvent } from "react";
import FallbackImage from "./FallbackImage";
import type { Category } from "./collectionData";
import { serif } from "./fonts";

type CategoryCardProps = {
  category: Category;
  index: number;
  lookCount: number;
  /** The first card is shown larger on desktop. */
  featured?: boolean;
  onSelect: (slug: string) => void;
};

export default function CategoryCard({
  category,
  index,
  lookCount,
  featured = false,
  onSelect,
}: CategoryCardProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(category.slug);
  };

  return (
    <a
      href={`#collection-${category.slug}`}
      onClick={handleClick}
      aria-label={`Explore ${category.name} — ${lookCount} looks`}
      className={`group relative block overflow-hidden rounded-2xl bg-stone-200 shadow-sm shadow-stone-900/5 outline-none transition-shadow duration-500 hover:shadow-xl hover:shadow-stone-900/10 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1eb] ${
        featured ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative w-full ${
          featured
            ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
            : "aspect-[4/5]"
        }`}
      >
        <FallbackImage
          src={category.image}
          alt={category.imageAlt}
          label={category.name}
          sizes={
            featured
              ? "(min-width: 1024px) 33vw, (min-width: 640px) 90vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-top transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.06]"
        />

        {/* Gradient so the text is always readable */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent transition-opacity duration-500 group-hover:opacity-90"
        />
      </div>

      {/* Top labels */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
        <span className="rounded-full bg-[#f6f1eb]/85 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-stone-700 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full bg-stone-950/35 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur">
          {lookCount} looks
        </span>
      </div>

      {/* Bottom text */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-[#f6f1eb] sm:p-6">
        <h3
          className={`${serif.className} font-light leading-none ${
            featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
          }`}
        >
          {category.name}
        </h3>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
          {category.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em]">
          <span className="relative">
            Explore
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
          </span>
          <span
            aria-hidden
            className="transition-transform duration-500 group-hover:translate-x-1.5"
          >
            →
          </span>
        </span>
      </div>
    </a>
  );
}
