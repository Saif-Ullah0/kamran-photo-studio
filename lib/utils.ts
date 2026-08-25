export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Approximate intrinsic dimensions per portfolio aspect category — gives
// next/image a correct-enough ratio to avoid layout shift and build a
// proper responsive srcset, while CSS (w-full h-auto / w-auto h-auto)
// still controls the actual rendered size.
export const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  portrait: { width: 800, height: 1000 },
  square: { width: 800, height: 800 },
  landscape: { width: 1200, height: 800 },
  tall: { width: 800, height: 1200 },
};