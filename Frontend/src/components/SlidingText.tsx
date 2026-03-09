import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  items: string[];
  intervalMs?: number;
};

export function SlidingText({ items, intervalMs = 3500 }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [items.length, intervalMs]);

  return (
    <div className="relative h-[7.5rem] md:h-[6.5rem] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <p className="font-mono text-sm md:text-base leading-relaxed text-muted-foreground">
            {items[idx]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
