"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const BANNERS = ["/img/menuBanner1.png", "/img/menuBanner2.png"];

export function PromoBanner() {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveBanner((current) => (current + 1) % BANNERS.length),
      4000,
    );

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[2.61/1] overflow-hidden rounded-lg shadow-sm">
      {BANNERS.map((src, index) => (
        <Image
          alt={`بنر پیشنهاد ویژه ${index + 1}`}
          className={`object-cover transition-opacity duration-500 ${
            activeBanner === index ? "opacity-100" : "opacity-0"
          }`}
          fill
          key={src}
          priority={index === 0}
          sizes="70vw"
          src={src}
        />
      ))}

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BANNERS.map((src, index) => (
          <button
            aria-label={`نمایش بنر ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              activeBanner === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
            }`}
            key={src}
            onClick={() => setActiveBanner(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
