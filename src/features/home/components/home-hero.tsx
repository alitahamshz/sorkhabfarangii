"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    background:
      "bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,.86)_1px,transparent_2px),radial-gradient(circle_at_70%_40%,rgba(255,255,255,.7)_1px,transparent_2px),linear-gradient(180deg,#fff_0%,#fff9fc_23%,#fde5f2_100%)]",
    imagePosition: "object-right-bottom",
  },
  {
    background:
      "bg-[radial-gradient(circle_at_22%_30%,rgba(255,255,255,.82)_1px,transparent_2px),radial-gradient(circle_at_78%_18%,rgba(255,255,255,.65)_1px,transparent_2px),linear-gradient(180deg,#fff_0%,#fff5fb_23%,#f9dbea_100%)]",
    imagePosition: "object-center-bottom",
  },
  {
    background:
      "bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,.84)_1px,transparent_2px),radial-gradient(circle_at_65%_46%,rgba(255,255,255,.68)_1px,transparent_2px),linear-gradient(180deg,#fff_0%,#fff8fc_23%,#f6d4e6_100%)]",
    imagePosition: "object-left-bottom",
  },
];

const DECORATIONS = [
  { className: "left-[12%] top-[16%] text-2xl text-white/70", symbol: "✦" },
  { className: "left-[24%] top-[38%] text-lg text-white/75", symbol: "✿" },
  { className: "left-[43%] top-[22%] text-xl text-white/60", symbol: "✦" },
  { className: "left-[63%] top-[51%] text-2xl text-white/60", symbol: "✿" },
  { className: "right-[20%] top-[27%] text-lg text-white/70", symbol: "✦" },
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
      className="mx-4 sm:mx-5 md:mx-auto md:w-[calc(100%-2.5rem)] md:max-w-[77.5rem]"
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
            className={`absolute inset-0 bg-[length:54px_54px,76px_76px,100%_100%] transition-opacity duration-700 ${
              slide.background
            } ${activeSlide === slideIndex ? "opacity-100" : "opacity-0"}`}
            key={slideIndex}
          >
            {DECORATIONS.map(({ className, symbol }, decorationIndex) => (
              <span
                aria-hidden
                className={`absolute ${className}`}
                key={decorationIndex}
              >
                {symbol}
              </span>
            ))}

            <div className="absolute bottom-0 right-0 h-[68%] w-[62%] md:w-[36%]">
              <Image
                alt=""
                className={`object-contain ${slide.imagePosition}`}
                fill
                priority={slideIndex === 0}
                sizes="(min-width: 768px) 36vw, 62vw"
                src="/img/woman.png"
              />
            </div>
          </article>
        ))}

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-zinc-600/30 px-2 py-1 backdrop-blur-sm">
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
                }`
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
