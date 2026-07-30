import Image from "next/image";

type SingleBannerProps = {
  image: string;
  alt: string;
};

/** Displays one responsive promotional banner. */
export function SingleBanner({ image, alt }: SingleBannerProps) {
  return (
    <section className="mx-auto max-w-[77.5rem] px-4 py-8 sm:px-5 md:py-10">
      <div className="relative aspect-[343/118] overflow-hidden rounded-lg">
        <Image alt={alt} className="object-cover" fill sizes="(max-width: 1240px) 100vw, 1240px" src={image} />
      </div>
    </section>
  );
}
