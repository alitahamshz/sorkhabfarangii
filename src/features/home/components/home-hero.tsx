"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    alt: "محصولات آرایش چشم شگلم",
    background: "bg-[#b6edf4]",
    src: "/img/banner1.webp",
  },
  {
    alt: "محصولات آرایش صورت شگلم",
    background: "bg-[#efc4a7]",
    src: "/img/banner2.webp",
  },
  {
    alt: "محصولات آرایش صورت شگلم",
    background: "bg-[#efc4a7]",
    src: "/img/banner3.webp",
  },
];

export function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % SLIDES.length),
      5000,
    );

    return () => window.clearInterval(timer);
  }, []);

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (touchEndX === undefined) return;

    const swipeDistance = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(swipeDistance) < 40) return;

    setActiveSlide((current) =>
      swipeDistance < 0
        ? (current + 1) % SLIDES.length
        : (current - 1 + SLIDES.length) % SLIDES.length,
    );
  }

  return (
    <section
      aria-label="پیشنهادهای ویژه"
      aria-roledescription="اسلایدر"
      className="mx-0 sm:mx-5 md:mx-auto md:w-[calc(100%-2.5rem)] md:max-w-[77.5rem]"
      data-home-slider
    >
      <div
        className="relative min-h-[620px] touch-pan-y overflow-hidden md:min-h-[760px]"
        onTouchCancel={() => {
          touchStartX.current = null;
        }}
        onTouchEnd={handleTouchEnd}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
      >
        {SLIDES.map((slide, slideIndex) => (
          <article
            aria-hidden={activeSlide !== slideIndex}
            className={`absolute inset-0 transition-opacity duration-700 ${slide.background} ${
              activeSlide === slideIndex ? "opacity-100" : "opacity-0"
            }`}
            key={slideIndex}
          >
            <Image
              alt={slide.alt}
              className="object-cover md:object-contain"
              fill
              priority={slideIndex === 0}
              sizes="(min-width: 1280px) 1240px, 100vw"
              src={slide.src}
            />
          </article>
        ))}

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-zinc-600/30 backdrop-blur-sm">
          {SLIDES.map((_, index) => {
            const isActive = activeSlide === index;
            return (
              <button
                aria-label={`نمایش اسلاید ${index + 1}`}
                aria-current={isActive}
                className={`rounded-full transition-all duration-100 ${
                  isActive
                    ? "size-1.25 bg-white top-3"
                    : "size-1 bg-white hover:bg-white/85"
                }`}
                key={index}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
