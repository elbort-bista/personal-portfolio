import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useProfile } from "@/hooks/use-portfolio";

export function Footer({ fullScreen = false }: { fullScreen?: boolean }) {
  const { data: profile } = useProfile();
  
  return (
    <footer className={`bg-card border-t border-primary/10 relative overflow-hidden ${fullScreen ? "min-h-screen flex items-center py-24" : "py-12"}`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          {profile?.avatarUrl && (
            <div className="w-12 h-12 rounded-none border border-primary/30 overflow-hidden shrink-0">
              <img 
                src={profile.avatarUrl} 
                alt="ELBORT.BISTA" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-mono font-bold text-foreground mb-1 uppercase">
              ELBORT <span className="text-primary">BISTA</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-xs font-mono">
              {profile?.footerTagline || "Securing digital landscapes through offensive security research and proactive risk mitigation."}
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          <a href={profile?.githubUrl || "#"} target={profile?.githubUrl ? "_blank" : undefined} rel={profile?.githubUrl ? "noopener noreferrer" : undefined} className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
            <Github className="w-5 h-5" />
          </a>
          <a href={profile?.linkedin || "https://www.linkedin.com/in/elbortbista"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href={profile?.twitterUrl || "#"} target={profile?.twitterUrl ? "_blank" : undefined} rel={profile?.twitterUrl ? "noopener noreferrer" : undefined} className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
            <Twitter className="w-5 h-5" />
          </a>
          <a href={`mailto:${profile?.email || "elbortbista@gmail.com"}`} className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-primary/5 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          {(() => {
            const y = new Date().getFullYear();
            const line = profile?.footerCopyright || `© {year} ELBORT.BISTA. All systems operational.`;
            return line.replaceAll("{year}", String(y));
          })()}
        </p>
      </div>
    </footer>
  );
}
