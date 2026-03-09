import { useBlogs } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Blog() {
  const { data: blogs } = useBlogs();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Intelligence Briefings"
            subtitle="Deep dives into security research, vulnerability analysis, and cyber trends."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {(blogs || []).map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="cyber-card bg-card/50 border border-primary/20 flex flex-col"
              >
                {blog.imageUrl && (
                  <div className="aspect-video overflow-hidden border-b border-primary/10">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono text-primary border border-primary/30 px-2 py-0.5 rounded">
                      {new Date(blog.createdAt ?? new Date()).toLocaleDateString()}
                    </span>
                    <div className="h-[1px] flex-grow bg-primary/10" />
                  </div>
                  <h3 className="text-xl font-mono font-bold mb-3">{blog.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">{(blog as any).excerpt || blog.content}</p>
                  <a href={`/blog/${blog.id}`}>
                    <Button variant="ghost" className="p-0 h-auto font-mono text-primary hover:bg-transparent hover:text-primary/80 flex items-center gap-2">
                      READ_FULL_REPORT <span className="text-lg">→</span>
                    </Button>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
