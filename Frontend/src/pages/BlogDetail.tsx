import { useBlogs } from "@/hooks/use-portfolio";
import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const id = Number(params?.id);
  const { data: blogs } = useBlogs();
  const blog = (blogs || []).find((b) => b.id === id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        {blog ? (
          <article className="prose prose-invert max-w-none">
            <h1 className="font-mono">{blog.title}</h1>
            {blog.imageUrl && (
              <img src={blog.imageUrl} alt={blog.title} className="rounded-lg border border-primary/20 my-6" />
            )}
            <div className="text-muted-foreground leading-7" dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
          </article>
        ) : (
          <div className="text-center py-24 font-mono text-muted-foreground">REPORT_NOT_FOUND</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
