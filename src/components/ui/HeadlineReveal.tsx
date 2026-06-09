import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

const TAGS = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

const variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(10px)" },
  show: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HeadlineReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof TAGS;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const MotionTag = TAGS[Tag];
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <MotionTag
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </MotionTag>
    </div>
  );
}
