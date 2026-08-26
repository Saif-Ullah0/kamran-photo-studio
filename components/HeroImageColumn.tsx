import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroImageColumnProps {
  images: string[];
  direction: "up" | "down";
  className?: string;
}

export default function HeroImageColumn({
  images,
  direction,
  className,
}: HeroImageColumnProps) {
  // Doubled so the CSS animation can loop seamlessly at -50%.
  const doubled = [...images, ...images];

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 px-3 py-3",
          direction === "down" ? "animate-scroll-down" : "animate-scroll-up"
        )}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="relative h-[220px] sm:h-[260px] lg:h-[280px] w-full shrink-0 overflow-hidden rounded-xl border border-line bg-charcoal"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 1024px) 22vw, 18vw"
              priority={true}
              loading="eager"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
