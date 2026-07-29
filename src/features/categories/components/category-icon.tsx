import {
  Gift,
  HeartPulse,
  Scissors,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Star,
  Zap,
} from "lucide-react";

type CategoryIconProps = {
  className?: string;
  name: string;
};

function LipstickIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M8.5 11.5h7v9h-7z" fill="currentColor" opacity=".25" />
      <path
        d="M8.5 11.5h7v9h-7zM7 20.5h10M9.5 11.5V7.8c0-1.4 1.1-2.5 2.5-2.5h.8c1.4 0 2.5 1.1 2.5 2.5v3.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.6 5.2 13.1 1.8c.7-.9 2-.2 1.7.9l-.8 2.6"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function CategoryIcon({
  className = "size-[18px] shrink-0 text-[#d81968]",
  name,
}: CategoryIconProps) {
  const iconProps = { className, strokeWidth: 1.7 };

  switch (name) {
    case "آرایشی":
      return <LipstickIcon className={className} />;
    case "پوستی":
      return <Sparkles {...iconProps} />;
    case "بهداشتی":
      return <HeartPulse {...iconProps} />;
    case "اکسسوری و گیفت":
      return <Gift {...iconProps} />;
    case "عطر و ادکلن":
    case "عطر و رایحه":
      return <SprayCan {...iconProps} />;
    case "مراقبت مو":
      return <Scissors {...iconProps} />;
    case "لوازم برقی":
      return <Zap {...iconProps} />;
    case "کیف و کفش":
      return <ShoppingBag {...iconProps} />;
    default:
      return <Star {...iconProps} />;
  }
}
