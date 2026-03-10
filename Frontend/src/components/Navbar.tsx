import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Menu, X, Shield, Terminal, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/use-portfolio";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: profile } = useProfile();
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", to: "about" },
    { name: "Skills", to: "skills" },
    { name: "Experience", to: "experience" },
    { name: "Blog", to: "blog" },
    { name: "Contact", to: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-primary/20 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {isHome ? (
          <Link to="hero" smooth={true} duration={500} className="cursor-pointer group">
            <div className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter text-foreground">
              <Shield className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_8px_rgba(22,163,74,0.8)] transition-all" />
              <span className="group-hover:text-primary transition-colors uppercase">ELBORT.BISTA</span>
            </div>
          </Link>
        ) : (
          <a href="/" className="cursor-pointer group">
            <div className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter text-foreground">
              <Shield className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_8px_rgba(22,163,74,0.8)] transition-all" />
              <span className="group-hover:text-primary transition-colors uppercase">ELBORT.BISTA</span>
            </div>
          </a>
        )}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.name === "Blog") {
              return (
                <a
                  key={link.name}
                  href="/blog"
                  className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  {link.name}
                </a>
              );
            }
            return isHome ? (
              <Link
                key={link.name}
                to={link.to}
                smooth={true}
                duration={500}
                spy={true}
                offset={-100}
                activeClass="text-primary text-glow"
                className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-all hover:-translate-y-0.5"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={`/#${link.to}`}
                className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-all hover:-translate-y-0.5"
              >
                {link.name}
              </a>
            );
          })}
          {profile?.cvUrl && (
            <a
              href={profile.cvUrl}
              download
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold font-mono text-background bg-primary hover:bg-primary/90 rounded border border-primary transition-all flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              CV.pdf
            </a>
          )}
          <a
            href="/login"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-all hover:-translate-y-0.5"
          >
            Admin
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-b border-primary/20 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => {
                if (link.name === "Blog") {
                  return (
                    <a
                      key={link.name}
                      href="/blog"
                      onClick={() => setIsOpen(false)}
                      className="text-base font-mono text-muted-foreground hover:text-primary py-2 px-4 hover:bg-primary/5 rounded transition-colors"
                    >
                      <span className="text-primary mr-2">&gt;</span>
                      {link.name}
                    </a>
                  );
                }
                return isHome ? (
                  <Link
                    key={link.name}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-mono text-muted-foreground hover:text-primary py-2 px-4 hover:bg-primary/5 rounded transition-colors"
                  >
                    <span className="text-primary mr-2">&gt;</span>
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`/#${link.to}`}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-mono text-muted-foreground hover:text-primary py-2 px-4 hover:bg-primary/5 rounded transition-colors"
                  >
                    <span className="text-primary mr-2">&gt;</span>
                    {link.name}
                  </a>
                );
              })}
          <a
            href="/login"
            onClick={() => setIsOpen(false)}
            className="text-base font-mono text-muted-foreground hover:text-primary py-2 px-4 hover:bg-primary/5 rounded transition-colors"
          >
            <span className="text-primary mr-2">&gt;</span>
            Admin
          </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
