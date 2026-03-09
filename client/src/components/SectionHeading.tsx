import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold font-mono text-foreground mb-4 relative inline-block">
          <span className="text-primary mr-2">&lt;</span>
          {title}
          <span className="text-primary ml-2">/&gt;</span>
        </h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {subtitle}
          </p>
        )}
        <div className="h-1 w-20 bg-primary/50 mx-auto mt-6 rounded-full blur-[2px]" />
      </motion.div>
    </div>
  );
}
