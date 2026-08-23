"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 90 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}
