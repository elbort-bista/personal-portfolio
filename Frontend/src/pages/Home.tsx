import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SkillCard } from "@/components/SkillCard";
import { TimelineItem } from "@/components/TimelineItem";
import { SectionHeading } from "@/components/SectionHeading";
import { useSkills, useExperience, useEducation, useContactMessage, useProfile, useBlogs, useCertifications } from "@/hooks/use-portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, Send, ShieldCheck, Bug, Lock, Server, Download, Upload } from "lucide-react";
import { Link } from "react-scroll";

export default function Home() {
  const { data: skills } = useSkills();
  const { data: experience } = useExperience();
  const { data: education } = useEducation();
  const { data: profile } = useProfile();
  const { data: blogs } = useBlogs();
  const { data: certifications } = useCertifications();
  const { mutate: sendMessage, isPending: isSending } = useContactMessage();
  const heroRolesRaw = (profile?.heroRoles ? profile.heroRoles.split("|") : []).map((r) => r.trim()).filter(Boolean);
  const heroRoles = heroRolesRaw.length
    ? heroRolesRaw
    : ["Offensive Security Researcher", "Penetration Tester", "Vulnerability Analyst", "Python Developer"];
  const roleSequence = heroRoles.flatMap((r) => [r, 2000]);

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    sendMessage(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20">
      <Navbar />

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 bg-grid-pattern">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-background/90" />
        
        <div className="container relative z-10 px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-block px-3 py-1 mb-4 border border-primary/30 rounded-full bg-primary/5 backdrop-blur-sm">
              <span className="text-primary font-mono text-xs font-bold tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {profile?.heroBadge || "SYSTEM SECURE"}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-6 leading-tight">
              {profile?.heroNamePrimary || "ELBORT."} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
                {profile?.heroNameAccent || "BISTA"}
              </span>
            </h1>
            
            <div className="text-xl md:text-2xl text-muted-foreground font-mono mb-8 h-[60px]">
              <span className="text-primary mr-2">&gt;</span>
              <TypeAnimation
                sequence={roleSequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
            
            <p className="text-muted-foreground max-w-lg text-lg mb-10 leading-relaxed border-l-2 border-primary/30 pl-4">
              {profile?.heroBio || "I break systems to make them stronger. Dedicated to identifying vulnerabilities and securing digital infrastructure against evolving cyber threats."}
            </p>

            {!((profile as any)?.hideHeroButtons) && (
              <div className="relative z-20 flex flex-wrap gap-4">
                <Link to="contact" smooth={true} duration={500}>
                  <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold tracking-wider rounded-none clip-path-polygon">
                    INITIATE_CONTACT
                  </Button>
                </Link>
                {profile?.cvUrl && (
                  <a href={profile.cvUrl} download target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="h-12 px-8 border-primary/50 text-primary hover:bg-primary/10 font-mono font-bold tracking-wider rounded-none flex items-center gap-2">
                      <Download className="w-4 h-4" /> DOWNLOAD_CV
                    </Button>
                  </a>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative w-60 h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[500px] lg:h-[500px] mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-none blur-[60px]" />
              <div className="relative z-10 grid grid-cols-2 gap-4 p-6 md:p-8 border border-primary/20 bg-card/30 backdrop-blur-md rounded-none md:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-background/80 p-5 md:p-6 rounded-none border border-primary/10 flex flex-col items-center justify-center gap-4 aspect-square group relative">
                  <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                  <span className="font-mono text-sm font-bold">VAPT</span>
                </div>
                <div className="bg-background/80 p-5 md:p-6 rounded-none border border-primary/10 flex flex-col items-center justify-center gap-4 aspect-square">
                  <Bug className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                  <span className="font-mono text-sm font-bold">Exploitation</span>
                </div>
                <div className="bg-background/80 p-5 md:p-6 rounded-none border border-primary/10 flex flex-col items-center justify-center gap-4 aspect-square">
                  <Lock className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                  <span className="font-mono text-sm font-bold">Coder</span>
                </div>
                <div className="bg-background/80 p-5 md:p-6 rounded-none border border-primary/10 flex flex-col items-center justify-center gap-4 aspect-square">
                  <Server className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                  <span className="font-mono text-sm font-bold">Network Sec</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Link to="about" smooth={true} duration={500} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-muted-foreground hover:text-primary transition-colors">
          <ChevronDown className="w-8 h-8" />
        </Link>
      </section>


      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-card/50 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="About Me" 
            subtitle="Enthusiastic Cyber Security Researcher with a strong background in Python development and Vulnerability Assessment."
          />
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-1 space-y-4"
            >
              <div className="cyber-card p-6 bg-background">
                <h3 className="text-primary font-mono text-4xl font-bold mb-2">{(profile as any)?.yearsExperience ?? 0}+</h3>
                <p className="text-muted-foreground text-sm font-mono uppercase">Years Experience</p>
              </div>
              <div className="cyber-card p-6 bg-background">
                <h3 className="text-primary font-mono text-4xl font-bold mb-2">{(profile as any)?.projectsSecured ?? 0}+</h3>
                <p className="text-muted-foreground text-sm font-mono uppercase">Projects Secured</p>
              </div>
              <div className="cyber-card p-6 bg-background">
                <h3 className="text-primary font-mono text-4xl font-bold mb-2">{(profile as any)?.majorCertifications ?? 0}+</h3>
                <p className="text-muted-foreground text-sm font-mono uppercase">Major Certifications</p>
              </div>
              <div className="cyber-card p-6 bg-background">
                <h3 className="text-primary font-mono text-4xl font-bold mb-2">{(profile as any)?.happyClients ?? 0}+</h3>
                <p className="text-muted-foreground text-sm font-mono uppercase">Happy Clients</p>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 cyber-card p-8 bg-background relative min-h-[60vh] flex flex-col"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              
              <h3 className="font-mono text-xl text-primary mb-6 mt-2">user@elbort:~$ cat profile.txt</h3>
              
              <div className="font-mono text-base md:text-lg leading-relaxed text-muted-foreground flex-1">
                <TypeAnimation
                  sequence={[
                    "As an Offensive Security Researcher, I specialize in identifying and exploiting vulnerabilities before malicious actors can. My approach combines technical expertise with a creative mindset to uncover hidden risks in complex systems. I have extensive experience with the OWASP Top 10, penetration testing methodologies, and secure coding practices. My goal is to bridge the gap between development and security, ensuring that applications are robust by design. Currently focusing on advanced web application security, API testing, and automating security workflows using Python.",
                    1_000_000,
                  ]}
                  wrapper="span"
                  speed={60}
                  cursor={true}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Technical Arsenal" 
            subtitle="Tools, languages, and frameworks I use to secure the digital frontier."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {skills?.map((skill, index) => (
              <SkillCard
                key={skill.id}
                name={skill.name}
                category={skill.category}
                proficiency={skill.proficiency ?? 0}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="py-24 bg-card/50 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Experience Log" subtitle="My professional journey in the cybersecurity landscape." />

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line for Desktop */}
            <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-primary/20 transform -translate-x-1/2" />
            
            <div className="space-y-12">
              {experience?.map((job, index) => (
                <TimelineItem
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  startDate={job.startDate}
                  endDate={job.endDate}
                  description={job.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Education */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-mono font-bold">Education</h3>
              </div>
              
              <div className="space-y-4">
                {education?.map((edu) => (
                  <motion.div 
                    key={edu.id}
                    whileHover={{ x: 10 }}
                    className="cyber-card p-6 border-l-4 border-l-primary"
                  >
                    <h4 className="text-lg font-bold text-foreground">{edu.institution}</h4>
                    <p className="text-primary font-mono text-sm mb-2">{edu.degree}</p>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {edu.year}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div id="certifications">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-mono font-bold">Certifications</h3>
              </div>

              <div className="space-y-4">
                {(certifications || [
                  { id: 1, name: "Certified Cyber Evasion Professional (CCEP)", certificateUrl: null },
                  { id: 2, name: "Certified Red Team Operations Manager (CRTOM)", certificateUrl: null },
                  { id: 3, name: "CompTIA Security+", certificateUrl: null },
                  { id: 4, name: "Certified Authorization Professional (CAP)", certificateUrl: null }
                ]).map((cert, i) => (
                  <motion.div 
                    key={cert.id || i}
                    whileHover={{ x: 10 }}
                    className={`flex items-center justify-between p-4 rounded-lg border border-border bg-card transition-colors ${cert.certificateUrl ? 'hover:border-primary cursor-pointer' : 'hover:border-primary/50'}`}
                    onClick={() => cert.certificateUrl && window.open(cert.certificateUrl, '_blank')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-mono text-sm md:text-base">{cert.name}</span>
                    </div>
                    {cert.certificateUrl && (
                      <div className="text-primary font-mono text-xs border border-primary/30 px-2 py-1 rounded">
                        VERIFY
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-card border-t border-primary/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="Initialize Connection" subtitle="Have a project in mind or want to discuss security? Send a signal." />

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-background border border-primary/20 p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-primary">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field} 
                            className="bg-card border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-primary">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="name@example.com" 
                            {...field} 
                            className="bg-card border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-primary">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your message..." 
                            className="min-h-[150px] bg-card border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold tracking-wider"
                    disabled={isSending}
                  >
                    {isSending ? (
                      "TRANSMITTING..." 
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" /> SEND_MESSAGE
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
