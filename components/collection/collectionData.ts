/**
 * All content for the Collection Showcase lives in this one file.
 *
 * To use your own photos:
 *   1. Put them in the `public/collections/` folder (e.g. public/collections/lehenga-1.jpg)
 *   2. Replace the `image` value with the path starting at "/" (e.g. "/collections/lehenga-1.jpg")
 *
 * To add a new look, copy one object in `looks` and change its values.
 * To add a new category, add it to `categories` and give looks that `category` slug.
 */

export type Category = {
  /** Used in links (#collection-lehengas) and to filter looks. Keep it lowercase, no spaces. */
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type Look = {
  id: string;
  /** Must match a `slug` from `categories`. */
  category: string;
  title: string;
  note: string;
  image: string;
  imageAlt: string;
};

// Small helper so every Unsplash URL is requested the same way.
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const categories: Category[] = [
  {
    slug: "lehengas",
    name: "Lehengas",
    description: "Traditional heirlooms and designer silhouettes for every celebration.",
    image: unsplash("1767955694884-d4bf352c23c2"),
    imageAlt: "Woman in an ornate yellow and maroon traditional Indian lehenga",
  },
  {
    slug: "tops",
    name: "Tops",
    description: "Easy, expressive pieces for everyday dressing.",
    image: unsplash("1764337593519-c51a77b4fc3d"),
    imageAlt: "Woman wearing a vibrant floral print blouse",
  },
  {
    slug: "shirts",
    name: "Shirts",
    description: "Crisp tailoring, from the boardroom to the weekend.",
    image: unsplash("1766471524299-016b52512780"),
    imageAlt: "Woman wearing a colourful paisley print shirt",
  },
  {
    slug: "jeans",
    name: "Jeans",
    description: "Denim cuts that move with you, day after day.",
    image: unsplash("1475178626620-a4d074967452"),
    imageAlt: "Woman standing in blue jeans and a white top",
  },
  {
    slug: "dresses",
    name: "Dresses & More",
    description: "Contemporary dresses, jumpsuits and statement outfits.",
    image: unsplash("1595777457583-95e059d581b8"),
    imageAlt: "Woman in a red sleeveless dress",
  },
];

export const looks: Look[] = [
  // Lehengas
  {
    id: "lehenga-saffron",
    category: "lehengas",
    title: "Saffron Heirloom",
    note: "Hand-embroidered festive lehenga",
    image: unsplash("1767955694884-d4bf352c23c2"),
    imageAlt: "Woman in an ornate yellow and maroon lehenga",
  },
  {
    id: "lehenga-bridal",
    category: "lehengas",
    title: "Crimson Vows",
    note: "Bridal lehenga with veil",
    image: unsplash("1759906760638-eeffcb471e53"),
    imageAlt: "Bride in a traditional red lehenga and veil",
  },
  {
    id: "lehenga-marigold",
    category: "lehengas",
    title: "Marigold Edit",
    note: "Ivory choli with a flowing yellow skirt",
    image: unsplash("1574847872646-abff244bbd87"),
    imageAlt: "Woman wearing a white crop top and a long yellow skirt",
  },

  // Tops
  {
    id: "top-bloom",
    category: "tops",
    title: "In Bloom",
    note: "Floral print blouse",
    image: unsplash("1764337593519-c51a77b4fc3d"),
    imageAlt: "Woman wearing a vibrant floral print blouse",
  },
  {
    id: "top-bow",
    category: "tops",
    title: "The Bow Blouse",
    note: "Soft florals with a tie neck",
    image: unsplash("1763559053411-80ae3727443e"),
    imageAlt: "Woman in a floral print blouse with a bow tie",
  },
  {
    id: "top-white-tee",
    category: "tops",
    title: "Perfect White Tee",
    note: "An everyday essential",
    image: unsplash("1546578623-d1d3af878403"),
    imageAlt: "Smiling woman in a white t-shirt",
  },

  // Shirts
  {
    id: "shirt-paisley",
    category: "shirts",
    title: "Paisley Story",
    note: "Relaxed printed shirt",
    image: unsplash("1766471524299-016b52512780"),
    imageAlt: "Woman wearing a colourful paisley print shirt",
  },
  {
    id: "shirt-white",
    category: "shirts",
    title: "The White Shirt",
    note: "Crisp cotton button-down",
    image: unsplash("1609369350243-83d11c675ff8"),
    imageAlt: "Woman in a white button-up shirt",
  },
  {
    id: "shirt-earth",
    category: "shirts",
    title: "Earth Tones",
    note: "Utility shirt styled with denim",
    image: unsplash("1760551600405-54c70e6d7f42"),
    imageAlt: "Woman in a brown shirt and jeans outdoors",
  },

  // Jeans
  {
    id: "jeans-everyday",
    category: "jeans",
    title: "Everyday Blue",
    note: "Straight-leg denim",
    image: unsplash("1475178626620-a4d074967452"),
    imageAlt: "Woman standing in blue jeans and a white top",
  },
  {
    id: "jeans-classic",
    category: "jeans",
    title: "Patchwork Denim",
    note: "Distressed, with patch details",
    image: unsplash("1541099649105-f69ad21f3246"),
    imageAlt: "Woman walking in distressed patchwork jeans",
  },
  {
    id: "jeans-trio",
    category: "jeans",
    title: "Wash Library",
    note: "Light, mid and dark washes",
    image: unsplash("1542272604-787c3835535d"),
    imageAlt: "Three pairs of jeans in different washes",
  },

  // Dresses & More
  {
    id: "dress-scarlet",
    category: "dresses",
    title: "Scarlet Hour",
    note: "Sleeveless midi dress",
    image: unsplash("1595777457583-95e059d581b8"),
    imageAlt: "Woman in a red sleeveless dress",
  },
  {
    id: "dress-ivory",
    category: "dresses",
    title: "Ivory Ruffles",
    note: "Off-shoulder statement look",
    image: unsplash("1609505848912-b7c3b8b4beda"),
    imageAlt: "Woman in a white off-shoulder ruffled outfit",
  },
  {
    id: "dress-jumpsuit",
    category: "dresses",
    title: "The Jumpsuit",
    note: "One-piece, effortless",
    image: unsplash("1495385794356-15371f348c31"),
    imageAlt: "Woman wearing a jumpsuit",
  },
];
