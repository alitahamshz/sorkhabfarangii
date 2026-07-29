import Image from "next/image";

export function BrandLogo() {
  return (
    <Image
      alt="سرخاب فرنگی"
      className="h-auto w-[70px] md:w-[120px]"
      height={58}
      priority
      src="/img/logo.svg"
      width={145}
    />
  );
}

               