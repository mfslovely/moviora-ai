"use client";

import Image from "next/image";
import { useState } from "react";
import { Clapperboard } from "lucide-react";

const POSTER_FALLBACK = "https://placehold.co/500x750/151922/f7f2ea?text=No+Poster";

type PosterImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function PosterImage({ src, alt, className = "object-cover", sizes, priority }: PosterImageProps) {
  const [imageSrc, setImageSrc] = useState(src || POSTER_FALLBACK);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white/[0.055] text-center text-white/55">
        <Clapperboard size={30} className="mb-2 text-ember" />
        <span className="px-3 text-xs font-medium uppercase tracking-[0.16em]">Poster unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        if (imageSrc === POSTER_FALLBACK) {
          setFailed(true);
          return;
        }
        setImageSrc(POSTER_FALLBACK);
      }}
    />
  );
}
