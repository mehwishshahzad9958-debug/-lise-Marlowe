import { Cormorant_Garamond, Inter } from "next/font/google";

// Same typefaces as the Hero section, so the whole page feels consistent.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const sans = Inter({ subsets: ["latin"], display: "swap" });
