import FallbackImage from "./FallbackImage";
import type { Look } from "./collectionData";
import { serif } from "./fonts";

type LookCardProps = {
  look: Look;
  categoryName: string;
};

export default function LookCard({ look, categoryName }: LookCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-200">
        <FallbackImage
          src={look.image}
          alt={look.imageAlt}
          label={categoryName}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-top transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h4 className={`${serif.className} text-2xl font-light leading-tight`}>
          {look.title}
        </h4>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-rose-800">
          {categoryName}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">{look.note}</p>
    </article>
  );
}
