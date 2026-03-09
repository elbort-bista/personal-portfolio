import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 border border-primary/30 bg-card/50 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>
          <Card className="bg-card/60 border-primary/20 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-primary" />
                <h1 className="font-mono text-2xl font-bold text-foreground tracking-widest">
                  SIGNAL LOST: 404
                </h1>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground font-mono">
                <p>The endpoint you are attempting to access is not available.</p>
                <p>Return to base or try another route.</p>
                <p>Please check your connectivity, or you may not have the required privileges to access this resource.</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/">
                  <Button className="font-mono">RETURN_HOME</Button>
                </a>
                <a href="/blog">
                  <Button variant="outline" className="font-mono border-primary/30">VIEW_INTEL</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
