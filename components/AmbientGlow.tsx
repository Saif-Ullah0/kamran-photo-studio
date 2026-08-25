import { cn } from "@/lib/utils";

interface AmbientGlowProps {
  className?: string;
}

export default function AmbientGlow({ className }: AmbientGlowProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 noise-overlay opacity-[0.035] mix-blend-overlay" />
      <div
        className={cn(
          "pointer-events-none absolute h-[380px] w-[380px] rounded-full bg-gold/[0.05] blur-[110px]",
          className
        )}
      />
    </>
  );
}
