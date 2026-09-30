"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlinePhotograph } from "react-icons/hi";
import type { ImageProps } from "next/image";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt?: string;
};

export default function SafeImage({ src, alt, fill, className = "", ...props }: SafeImageProps) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={`flex items-center justify-center bg-[#eef0f3] text-ink-soft/40 ${
          fill ? "absolute inset-0" : "w-full h-full"
        }`}
      >
        <HiOutlinePhotograph size={24} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || ""}
      fill={fill}
      className={className}
      onError={() => setBroken(true)}
      {...props}
    />
  );
}
