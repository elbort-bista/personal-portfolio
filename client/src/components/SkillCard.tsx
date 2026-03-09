import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SkillCardProps {
  name: string;
  category: string;
  proficiency: number;
  delay?: number;
}

export function SkillCard({ name, category, proficiency, delay = 0 }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="cyber-card p-5 group"
    >
      <div className="flex justify-between items-end mb-2">
        <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <span className="text-xs text-primary/70 font-mono">{proficiency}%</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">{category}</p>
      <Progress value={proficiency} className="h-1.5 bg-secondary" />
    </motion.div>
  );
}
