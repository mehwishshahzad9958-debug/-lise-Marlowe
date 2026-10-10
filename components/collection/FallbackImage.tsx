"use client";

import Image from "next/image";
import { useState } from "react";

type FallbackImageProps = {
  src: string;
  alt: string;
  /** Text shown on the placeholder if the photo can't load. */
  label: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * A next/image that fills its parent (the parent must be `relative`).
 * If the image fails to load, it shows a soft neutral placeholder instead
 * of a broken-image icon.
 */
export default function FallbackImage({
  src,
  alt,
  label,
  sizes,
  className = "",
  priority = false,
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#efe6dc] via-[#e7dacb] to-[#d9c7b4]"
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
