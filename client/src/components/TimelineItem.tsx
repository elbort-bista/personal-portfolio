import { motion } from "framer-motion";
import { Calendar, MapPin, Briefcase } from "lucide-react";

interface TimelineItemProps {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  index: number;
}

export function TimelineItem({ title, company, location, startDate, endDate, description, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}
    >
      {/* Connector Line & Dot */}
      <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full transform -translate-x-1/2 z-10 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(22,163,74,0.8)] transition-all duration-300" />
      
      {/* Empty space for alternating layout */}
      <div className="hidden md:block w-5/12" />

      {/* Content Card */}
      <div className="w-[calc(100%-2.5rem)] md:w-5/12 pl-10 md:pl-0">
        <div className="cyber-card p-6 bg-card/50 backdrop-blur-sm">
          <h3 className="text-xl font-bold font-mono text-primary mb-1">{title}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {startDate} - {endDate || "Present"}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
