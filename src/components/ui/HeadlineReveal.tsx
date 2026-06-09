import { motion } from "motion/react";
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

/**
 * Masked slide-up reveal for headlines: the line rises out of an overflow-hidden
 * frame with a blur-to-sharp settle, like a curtain lifting off the type.
 */
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
  const MotionTag = TAGS[Tag];
  return (
    <div className={`overflow-hidden ${className}`}>
      <MotionTag
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </MotionTag>
    </div>
  );
}
