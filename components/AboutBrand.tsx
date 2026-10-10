import FallbackImage from "./collection/FallbackImage";
import { sans, serif } from "./collection/fonts";

/**
 * "About the Brand" section.
 * All text and images are defined at the top of this file so they are easy to edit.
 * To use your own photos, put them in `public/about/` and change `src`
 * to a path like "/about/occasion.jpg".
 */

const images = {
  occasion: {
    src: "https://images.unsplash.com/photo-1746372283841-dbb3838f9935?auto=format&fit=crop&w=1200&q=80",
    alt: "Woman in an elegant traditional Indian outfit posing in a doorway",
    caption: "Occasion",
  },
  everyday: {
    src: "https://images.unsplash.com/photo-1760551600405-54c70e6d7f42?auto=format&fit=crop&w=900&q=80",
    alt: "Woman in a brown shirt and jeans outdoors",
    caption: "Everyday",
  },
};

const pillars = [
  {
    title: "Designer Lehengas",
    text: "Rich colour, intricate detail and graceful silhouettes for weddings, festivals and celebrations.",
  },
  {
    title: "Tops & Shirts",
    text: "Contemporary shapes, from relaxed prints to crisp, tailored classics.",
  },
  {
    title: "Everyday Denim",
    text: "Jeans in versatile cuts and washes for real days and easy styling.",
  },
  {
    title: "For Every Occasion",
    text: "Dresses and statement pieces that adapt to your plans and your personal style.",
  },
];

const values = [
  { title: "Individuality", text: "Style that reflects who you are, not just what’s trending." },
  { title: "Thoughtful Style", text: "Pieces chosen with care, made to be worn again and again." },
  { title: "Versatility", text: "Looks that move easily from celebration to everyday." },
  { title: "Confidence", text: "Clothes that help you feel at ease in your own skin." },
];

export default function AboutBrand() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={`${sans.className} relative scroll-mt-4 overflow-hidden bg-[#fbf8f3] text-stone-900`}
    >
      {/* Soft background accent, echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-amber-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        {/* ---------- A. Brand introduction ---------- */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-rose-800">
              <span className="h-px w-10 bg-rose-800" />
              About the Brand
            </p>
            <h2
              id="about-heading"
              className={`${serif.className} text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl`}
            >
              Style that <span className="italic text-rose-800">tells</span>
              <br />
              your story.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-stone-600 sm:text-lg lg:col-span-5 lg:pb-2">
            Getting dressed should feel like self-expression, not a set of
            rules. Our label brings together occasion wear rooted in Indian
            craft and the modern pieces you reach for every day — so your
            wardrobe moves with you, and you wear it with confidence.
          </p>
        </div>

        {/* ---------- B + C. Visual storytelling + philosophy ---------- */}
        <div className="mt-16 grid items-center gap-16 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Image composition */}
          <div className="relative pb-16 pr-10 sm:pb-20 sm:pr-24 lg:col-span-6 lg:pr-20">
            <figure className="group relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-stone-200 shadow-2xl shadow-stone-900/10">
                <FallbackImage
                  src={images.occasion.src}
                  alt={images.occasion.alt}
                  label={images.occasion.caption}
                  sizes="(min-width: 1024px) 38vw, 80vw"
                  className="object-top transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-4 text-[10px] uppercase tracking-[0.35em] text-stone-500">
                {images.occasion.caption}
              </figcaption>
            </figure>

            <figure className="group absolute bottom-0 right-0 w-[45%] sm:w-[42%]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-4 border-[#fbf8f3] bg-stone-200 shadow-xl">
                <FallbackImage
                  src={images.everyday.src}
                  alt={images.everyday.alt}
                  label={images.everyday.caption}
                  sizes="(min-width: 1024px) 18vw, 40vw"
                  className="object-top transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-3 text-right text-[10px] uppercase tracking-[0.35em] text-stone-500">
                {images.everyday.caption}
              </figcaption>
            </figure>
          </div>

          {/* Philosophy */}
          <div className="lg:col-span-6 lg:pl-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
              Our Philosophy
            </p>
            <h3
              className={`${serif.className} mt-4 text-4xl font-light leading-tight sm:text-5xl`}
            >
              One wardrobe, <span className="italic">many</span> moments.
            </h3>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">
              Each piece is chosen to stand on its own and to work with the
              rest of the collection — so a festive look and a weekday outfit
              can share the same sense of style.
            </p>

            <ul className="mt-10 border-t border-stone-900/10">
              {pillars.map((pillar, index) => (
                <li
                  key={pillar.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-stone-900/10 py-5"
                >
                  <span className="pt-1 text-[10px] uppercase tracking-[0.3em] text-rose-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className={`${serif.className} text-2xl font-light leading-tight`}>
                      {pillar.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-stone-500">
                      {pillar.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- D. Brand values ---------- */}
        <div className="mt-24 sm:mt-32">
          <p className="text-center text-[11px] uppercase tracking-[0.35em] text-stone-500">
            What We Value
          </p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-stone-900/10 bg-stone-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <li
                key={value.title}
                className="group bg-[#fbf8f3] p-8 transition-colors duration-500 hover:bg-[#f6f1eb] sm:p-10"
              >
                {/* Small decorative diamond */}
                <span
                  aria-hidden
                  className="block h-2 w-2 rotate-45 bg-rose-800/70 transition-transform duration-500 group-hover:rotate-[135deg]"
                />
                <h3
                  className={`${serif.className} mt-6 text-3xl font-light leading-none`}
                >
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">
                  {value.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- E. Call to action ---------- */}
        <div className="mt-20 flex flex-col items-center text-center sm:mt-24">
          <p className={`${serif.className} text-3xl font-light italic sm:text-4xl`}>
            Find the pieces that tell yours.
          </p>
          <a
            href="#collections"
            className="group mt-6 inline-flex items-center gap-3 rounded-sm text-xs uppercase tracking-[0.3em] text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf8f3]"
          >
            <span className="relative pb-1">
              Explore Our Collection
              <span className="absolute bottom-0 left-0 h-px w-full bg-stone-900/30" />
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-rose-800 transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              ↑
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
