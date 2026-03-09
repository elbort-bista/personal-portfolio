import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogSchema, type InsertBlog, insertSkillSchema, type InsertSkill, insertEducationSchema, type InsertEducation, insertCertificationSchema, type InsertCertification, insertExperienceSchema, type InsertExperience, insertProfileSchema, type InsertProfile } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateBlog, useUploadProfile, useSkills, useExperience, useEducation, useCertifications, useProfile, useBlogs } from "@/hooks/use-portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Upload, FileText, Image as ImageIcon, LogOut, MessageSquare, Users, Wrench, FilePlus, ShieldCheck, Server, Bug } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function Admin() {
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/login";
      }
    })();
  }, []);
  const { mutate: createBlog, isPending: isCreatingBlog } = useCreateBlog();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadProfile();
  const { data: skills } = useSkills();
  const { data: experience } = useExperience();
  const { data: education } = useEducation();
  const { data: certifications } = useCertifications();
  const { data: profile } = useProfile();
  const { data: allBlogs } = useBlogs();
  
  const blogForm = useForm<InsertBlog>({
    resolver: zodResolver(insertBlogSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      published: true as any,
    },
  });

  const onBlogSubmit = (data: InsertBlog) => {
    createBlog(data, {
      onSuccess: () => blogForm.reset(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append(type, file);
      uploadFiles(formData);
    }
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<Array<{ email: string }>>([]);
  const [stats, setStats] = useState<{
    messages: number;
    blogs: number;
    skills: number;
    experience: number;
    certifications: number;
    education: number;
    users: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const fetchOpts: RequestInit = { credentials: "include", cache: "no-store" as RequestCache };
        const m = await fetch("/api/messages", fetchOpts).then((r) => (r.ok ? r.json() : []));
        const u = await fetch("/api/users", fetchOpts).then((r) => (r.ok ? r.json() : []));
        const s = await fetch("/api/stats", fetchOpts).then((r) => (r.ok ? r.json() : null));
        setMessages(m || []);
        setUsers(u || []);
        setStats(s);
      } catch {}
    })();
  }, []);

  const addUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const addUserForm = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { email: "", password: "" },
  });
  const onAddUser = async (values: z.infer<typeof addUserSchema>) => {
    try {
      await apiRequest("POST", "/api/users", values);
      addUserForm.reset();
      const u = await fetch("/api/users", { credentials: "include", cache: "no-store" }).then((r) => (r.ok ? r.json() : []));
      setUsers(u || []);
      alert("User added");
    } catch (err: any) {
      alert(err?.message || "Failed to add user");
    }
  };

  const changePasswordSchema = z.object({
    email: z.string().email(),
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  });
  const changePwdForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { email: "", currentPassword: "", newPassword: "" },
  });
  const onChangePassword = async (values: z.infer<typeof changePasswordSchema>) => {
    try {
      const res = await apiRequest("POST", "/api/users/change-password", values);
      if (res.ok) {
        changePwdForm.reset();
        alert("Password changed");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to change password");
    }
  };

  const onLogout = async () => {
    await apiRequest("POST", "/api/logout");
    window.location.href = "/login";
  };

  const profileForm = useForm<Partial<InsertProfile>>({
    resolver: zodResolver(insertProfileSchema.partial()),
    defaultValues: {
      heroBadge: "",
      heroNamePrimary: "",
      heroNameAccent: "",
      heroRoles: "",
      heroBio: "",
      footerTagline: "",
      githubUrl: "",
      linkedin: "",
      twitterUrl: "",
      email: "",
    },
  });
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        heroBadge: profile.heroBadge ?? "",
        heroNamePrimary: profile.heroNamePrimary ?? "",
        heroNameAccent: profile.heroNameAccent ?? "",
        heroRoles: profile.heroRoles ?? "",
        heroBio: profile.heroBio ?? "",
        footerTagline: profile.footerTagline ?? "",
        yearsExperience: (profile as any).yearsExperience ?? (2 as any),
        projectsSecured: (profile as any).projectsSecured ?? (10 as any),
        majorCertifications: (profile as any).majorCertifications ?? (4 as any),
        happyClients: (profile as any).happyClients ?? (0 as any),
        footerCopyright: (profile as any).footerCopyright ?? "© {year} ELBORT.BISTA. All systems operational.",
        hideHeroButtons: (profile as any).hideHeroButtons ?? false,
        githubUrl: profile.githubUrl ?? "",
        linkedin: profile.linkedin ?? "",
        twitterUrl: profile.twitterUrl ?? "",
        email: profile.email ?? "",
      });
    }
  }, [profile]);
  const onProfileSubmit = async (values: Partial<InsertProfile>) => {
    await apiRequest("PATCH", "/api/profile", values);
  };

  const certificationForm = useForm<InsertCertification>({
    resolver: zodResolver(insertCertificationSchema),
    defaultValues: { name: "", issuer: "", year: "", certificateUrl: "" },
  });

  const experienceForm = useForm<InsertExperience>({
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
  });

  const educationForm = useForm<InsertEducation>({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: { degree: "", institution: "", year: "" },
  });

  const skillForm = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: { name: "", category: "", proficiency: 100 } as InsertSkill,
  });

  const onCertificationSubmit = async (values: InsertCertification) => {
    await apiRequest("POST", "/api/certifications", values);
    window.location.reload();
  };

  const onExperienceSubmit = async (values: InsertExperience) => {
    await apiRequest("POST", "/api/experience", values);
    window.location.reload();
  };

  const onEducationSubmit = async (values: InsertEducation) => {
    await apiRequest("POST", "/api/education", values);
    window.location.reload();
  };

  const onSkillSubmit = async (values: InsertSkill) => {
    await apiRequest("POST", "/api/skills", values);
    window.location.reload();
  };

  const [section, setSection] = useState<"dashboard" | "messages" | "users" | "blog" | "assets" | "certifications" | "experience" | "education" | "skills">("dashboard");

  const dashboardData = stats
    ? [
        { name: "Certifications", count: stats.certifications },
        { name: "Experience", count: stats.experience },
        { name: "Education", count: stats.education ?? 0 },
        { name: "Technical Arsenal", count: stats.skills },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      <div className="mx-auto px-4 py-8 md:py-16 max-w-[1400px] flex-1">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3">
            <Card className="bg-card/60 border-primary/20 sticky top-20">
              <CardContent className="p-4 space-y-2">
                <button onClick={() => setSection("dashboard")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="dashboard"?"bg-primary/10":""}`}>
                  <Wrench className="w-4 h-4" /> Dashboard
                </button>
                <button onClick={() => setSection("messages")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="messages"?"bg-primary/10":""}`}>
                  <MessageSquare className="w-4 h-4" /> Contact Messages
                </button>
                <button onClick={() => setSection("users")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="users"?"bg-primary/10":""}`}>
                  <Users className="w-4 h-4" /> User Management
                </button>
                <button onClick={() => setSection("blog")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="blog"?"bg-primary/10":""}`}>
                  <FilePlus className="w-4 h-4" /> Blog Management
                </button>
                <button onClick={() => setSection("assets")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="assets"?"bg-primary/10":""}`}>
                  <ImageIcon className="w-4 h-4" /> Profile Assets
                </button>
                <button onClick={() => setSection("certifications")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="certifications"?"bg-primary/10":""}`}>
                  <ShieldCheck className="w-4 h-4" /> Certifications
                </button>
                <button onClick={() => setSection("experience")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="experience"?"bg-primary/10":""}`}>
                  <Wrench className="w-4 h-4" /> Experience
                </button>
                <button onClick={() => setSection("education")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="education"?"bg-primary/10":""}`}>
                  <Server className="w-4 h-4" /> Education
                </button>
                <button onClick={() => setSection("skills")} className={`flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 text-sm font-mono ${section==="skills"?"bg-primary/10":""}`}>
                  <Bug className="w-4 h-4" /> Technical Arsenal
                </button>
                <div className="pt-2">
                  <Button variant="outline" onClick={onLogout} className="w-full flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Log Out
                  </Button>
                </div>
                <div>
                  <a href="/" className="w-full inline-flex items-center justify-center rounded border border-primary/30 px-3 py-2 text-sm font-mono hover:bg-primary/10">Home Website</a>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="col-span-12 md:col-span-9 space-y-8">
            {section === "dashboard" && (
            <section>
              <h2 className="text-2xl font-mono font-bold mb-4">Admin Dashboard Overview</h2>
              <Card className="bg-card/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-mono text-primary text-xl">Resource Count Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6b46c1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-mono text-muted-foreground">Certifications</div>
                    <div className="text-2xl font-mono font-bold">{stats?.certifications ?? 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-mono text-muted-foreground">Experience</div>
                    <div className="text-2xl font-mono font-bold">{stats?.experience ?? 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-mono text-muted-foreground">Education</div>
                    <div className="text-2xl font-mono font-bold">{stats?.education ?? 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-mono text-muted-foreground">Technical Arsenal</div>
                    <div className="text-2xl font-mono font-bold">{stats?.skills ?? 0}</div>
                  </CardContent>
                </Card>
              </div>
            </section>
            )}

            {section === "certifications" && (
            <section>
              <h2 className="text-2xl font-mono font-bold mb-4">Certifications</h2>
              <div className="mb-4">
                <Form {...certificationForm}>
                  <form onSubmit={certificationForm.handleSubmit(onCertificationSubmit)} className="grid md:grid-cols-4 gap-3">
                    <FormField control={certificationForm.control} name="name" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">NAME</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={certificationForm.control} name="year" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">YEAR</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={certificationForm.control} name="certificateUrl" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex items-end"><Button type="submit" className="w-full bg-primary">ADD</Button></div>
                  </form>
                </Form>
              </div>
              <div className="space-y-3">
                {(certifications || []).map((c) => (
                  <Card key={c.id} className="bg-card/50 border-primary/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="font-mono">
                        <div className="text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.year}</div>
                      </div>
                      {c.certificateUrl && (
                        <a className="text-primary text-xs font-mono border border-primary/30 px-2 py-1 rounded" href={c.certificateUrl} target="_blank" rel="noopener noreferrer">VIEW</a>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={async () => { const name = prompt("Name", c.name || ""); const year = prompt("Year", c.year || ""); const url = prompt("URL", c.certificateUrl || ""); if (name) { await apiRequest("PATCH", `/api/certifications/${c.id}`, { name, year, certificateUrl: url }); window.location.reload(); } }}>EDIT</Button>
                        <Button variant="destructive" onClick={async () => { await apiRequest("DELETE", `/api/certifications/${c.id}`); window.location.reload(); }}>DELETE</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            )}

            {section === "experience" && (
            <section>
              <h2 className="text-2xl font-mono font-bold mb-4">Experience</h2>
              <div className="mb-4">
                <Form {...experienceForm}>
                  <form onSubmit={experienceForm.handleSubmit(onExperienceSubmit)} className="grid md:grid-cols-3 gap-3">
                    <FormField control={experienceForm.control} name="title" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">TITLE</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={experienceForm.control} name="company" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">COMPANY</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={experienceForm.control} name="location" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">LOCATION</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={experienceForm.control} name="startDate" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">START</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={experienceForm.control} name="endDate" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">END</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={experienceForm.control} name="description" render={({ field }) => (<FormItem className="md:col-span-3"><FormLabel className="font-mono text-xs">DESCRIPTION</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="md:col-span-3 flex items-end"><Button type="submit" className="bg-primary">ADD</Button></div>
                  </form>
                </Form>
              </div>
              <div className="space-y-3">
                {(experience || []).map((e) => (
                  <Card key={e.id} className="bg-card/50 border-primary/20">
                    <CardContent className="p-4">
                      <div className="font-mono text-sm font-bold">{e.title} — {e.company}</div>
                      <div className="text-xs text-muted-foreground">{e.location} • {e.startDate} {e.endDate ? `→ ${e.endDate}` : ""}</div>
                      <div className="mt-2 text-sm">{e.description}</div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" onClick={async () => { const title = prompt("Title", e.title || ""); const company = prompt("Company", e.company || ""); const location = prompt("Location", e.location || ""); const startDate = prompt("Start", e.startDate || ""); const endDate = prompt("End", e.endDate || ""); const description = prompt("Description", e.description || ""); await apiRequest("PATCH", `/api/experience/${e.id}`, { title, company, location, startDate, endDate, description }); window.location.reload(); }}>EDIT</Button>
                        <Button variant="destructive" onClick={async () => { await apiRequest("DELETE", `/api/experience/${e.id}`); window.location.reload(); }}>DELETE</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            )}

            {section === "education" && (
            <section>
              <h2 className="text-2xl font-mono font-bold mb-4">Education</h2>
              <div className="mb-4">
                <Form {...educationForm}>
                  <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="grid md:grid-cols-3 gap-3">
                    <FormField control={educationForm.control} name="institution" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">INSTITUTION</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={educationForm.control} name="degree" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">DEGREE</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={educationForm.control} name="year" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">YEAR</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex items-end"><Button type="submit" className="bg-primary">ADD</Button></div>
                  </form>
                </Form>
              </div>
              <div className="space-y-3">
                {(education || []).map((ed) => (
                  <Card key={ed.id} className="bg-card/50 border-primary/20">
                    <CardContent className="p-4">
                      <div className="font-mono text-sm font-bold">{ed.institution}</div>
                      <div className="text-xs text-muted-foreground">{ed.degree} • {ed.year}</div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" onClick={async () => { const institution = prompt("Institution", ed.institution || ""); const degree = prompt("Degree", ed.degree || ""); const year = prompt("Year", ed.year || ""); await apiRequest("PATCH", `/api/education/${ed.id}`, { institution, degree, year }); window.location.reload(); }}>EDIT</Button>
                        <Button variant="destructive" onClick={async () => { await apiRequest("DELETE", `/api/education/${ed.id}`); window.location.reload(); }}>DELETE</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            )}

            {section === "skills" && (
            <section>
              <h2 className="text-2xl font-mono font-bold mb-4">Technical Arsenal</h2>
              <div className="mb-4">
                <Form {...skillForm}>
                  <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="grid md:grid-cols-4 gap-3">
                    <FormField control={skillForm.control} name="name" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">NAME</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={skillForm.control} name="category" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">CATEGORY</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={skillForm.control} name="proficiency" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">PROFICIENCY</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 100} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex items-end"><Button type="submit" className="bg-primary">ADD</Button></div>
                  </form>
                </Form>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {(skills || []).map((s) => (
                  <Card key={s.id} className="bg-card/50 border-primary/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="font-mono">
                        <div className="text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.category}</div>
                      </div>
                      <div className="text-xs font-mono">{s.proficiency ?? 0}%</div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={async () => { const name = prompt("Name", s.name || ""); const category = prompt("Category", s.category || ""); const proficiencyStr = prompt("Proficiency", String(s.proficiency ?? 100)); const proficiency = Number(proficiencyStr || "0"); await apiRequest("PATCH", `/api/skills/${s.id}`, { name, category, proficiency }); window.location.reload(); }}>EDIT</Button>
                        <Button variant="destructive" onClick={async () => { await apiRequest("DELETE", `/api/skills/${s.id}`); window.location.reload(); }}>DELETE</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            )}
            {section === "blog" && (
            <section>
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-xl">CREATE_BLOG_POST</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...blogForm}>
                <form onSubmit={blogForm.handleSubmit(onBlogSubmit)} className="space-y-4">
                  <FormField
                    control={blogForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">TITLE</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={blogForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">IMAGE_URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={blogForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">EXCERPT (FRONT PAGE)</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value ?? ""} className="bg-background border-primary/20 min-h-[120px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={blogForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="font-mono text-xs">FULL_CONTENT</FormLabel>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={(html) => field.onChange(html)}
                          onUploadImage={async (file) => {
                            const fd = new FormData();
                            fd.append("file", file);
                            const res = await fetch("/api/blogs/upload-image", { method: "POST", body: fd, credentials: "include" });
                            const json = await res.json();
                            return json.url as string;
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-3">
                    <label className="font-mono text-xs">PUBLISHED</label>
                    <input
                      type="checkbox"
                      checked={(blogForm.getValues().published as any) ?? true}
                      onChange={(e) => blogForm.setValue("published" as any, e.target.checked as any)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary mt-2" disabled={isCreatingBlog}>
                    {isCreatingBlog ? "PUBLISHING..." : "PUBLISH_POST"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {(allBlogs || []).map((b) => (
              <Card key={b.id} className="bg-card/50 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono font-bold">{b.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(b.createdAt ?? new Date()).toLocaleString()}</div>
                      {b.imageUrl && <div className="mt-2 text-xs text-muted-foreground truncate">{b.imageUrl}</div>}
                    </div>
                    <div className="text-xs font-mono px-2 py-1 border rounded">{b.published ? "PUBLIC" : "PRIVATE"}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" onClick={async () => {
                      const title = prompt("Title", b.title || "") || "";
                      const imageUrl = prompt("Image URL", b.imageUrl || "") || "";
                      const content = prompt("Content", b.content || "") || "";
                      await apiRequest("PATCH", `/api/blogs/${b.id}`, { title, imageUrl, content });
                      window.location.reload();
                    }}>EDIT</Button>
                    <Button variant="outline" onClick={async () => {
                      await apiRequest("PATCH", `/api/blogs/${b.id}`, { published: !b.published });
                      window.location.reload();
                    }}>{b.published ? "MAKE_PRIVATE" : "MAKE_PUBLIC"}</Button>
                    <Button variant="destructive" onClick={async () => {
                      if (confirm("Delete this blog?")) {
                        await apiRequest("DELETE", `/api/blogs/${b.id}`);
                        window.location.reload();
                      }
                    }}>DELETE</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
            </section>
            )}

            {section === "assets" && (
            <section>
          <Card className="bg-card/50 border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-xl">PROFILE_CONTENT</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="grid md:grid-cols-2 gap-4">
                  <FormField control={profileForm.control} name="heroBadge" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">HERO_BADGE</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="heroRoles" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">HERO_ROLES</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="Role1|Role2|Role3" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="heroNamePrimary" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">HERO_NAME_PRIMARY</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="heroNameAccent" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">HERO_NAME_ACCENT</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="heroBio" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-mono text-xs">HERO_BIO</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="footerTagline" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-mono text-xs">FOOTER_TAGLINE</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="flex items-center gap-3">
                    <label className="font-mono text-xs">HIDE_HERO_BUTTONS</label>
                    <input
                      type="checkbox"
                      checked={(profileForm.getValues().hideHeroButtons as any) ?? false}
                      onChange={(e) => profileForm.setValue("hideHeroButtons" as any, e.target.checked as any)}
                    />
                  </div>
                  <FormField control={profileForm.control} name="yearsExperience" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">YEARS_EXPERIENCE</FormLabel><FormControl><Input type="number" {...field} value={(field.value as any) ?? 0} onChange={(e)=>field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="projectsSecured" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">PROJECTS_SECURED</FormLabel><FormControl><Input type="number" {...field} value={(field.value as any) ?? 0} onChange={(e)=>field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="majorCertifications" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">MAJOR_CERTIFICATIONS</FormLabel><FormControl><Input type="number" {...field} value={(field.value as any) ?? 0} onChange={(e)=>field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="happyClients" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">HAPPY_CLIENTS</FormLabel><FormControl><Input type="number" {...field} value={(field.value as any) ?? 0} onChange={(e)=>field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="footerCopyright" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-mono text-xs">FOOTER_COPYRIGHT (use {'{year}'} token)</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="githubUrl" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">GITHUB_URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">LINKEDIN_URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="twitterUrl" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">TWITTER_URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel className="font-mono text-xs">CONTACT_EMAIL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="md:col-span-2 flex items-end">
                    <Button type="submit" className="bg-primary">SAVE_PROFILE</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-xl">MANAGE_PROFILE_ASSETS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase">Avatar Image</label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10 flex items-center gap-2"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={isUploading}
                  >
                    <ImageIcon className="w-4 h-4" /> {isUploading ? "UPLOADING..." : "UPLOAD_AVATAR"}
                  </Button>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'avatar')} 
                  />
                  {profile?.avatarUrl && (
                    <div className="shrink-0 w-12 h-12 rounded-full border border-primary/30 overflow-hidden">
                      <img src={`${profile.avatarUrl}?v=${Date.now()}`} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase">CV Document (PDF)</label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10 flex items-center gap-2"
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    disabled={isUploading}
                  >
                    <FileText className="w-4 h-4" /> {isUploading ? "UPLOADING..." : "UPLOAD_CV"}
                  </Button>
                  <input 
                    id="cv-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={(e) => handleFileUpload(e, 'cv')} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground uppercase">Favicon (ICO/PNG)</label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10 flex items-center gap-2"
                    onClick={() => document.getElementById('favicon-upload')?.click()}
                    disabled={isUploading}
                  >
                    <ImageIcon className="w-4 h-4" /> {isUploading ? "UPLOADING..." : "UPLOAD_FAVICON"}
                  </Button>
                  <input 
                    id="favicon-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".ico,image/x-icon,image/png,image/svg+xml" 
                    onChange={(e) => handleFileUpload(e, 'favicon')} 
                  />
                  {profile?.faviconUrl && (
                    <img src={`${profile.faviconUrl}?v=${Date.now()}`} alt="favicon" className="w-6 h-6 border border-primary/30 rounded" />
                  )}
                </div>
              </div>

              
            </CardContent>
          </Card>
            </section>
            )}

            {section === "users" && (
            <section>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-xl">ADD_USER</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...addUserForm}>
                <form onSubmit={addUserForm.handleSubmit(onAddUser)} className="space-y-4">
                  <FormField
                    control={addUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">EMAIL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addUserForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">PASSWORD</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary">ADD_USER</Button>
                </form>
              </Form>
              <div className="mt-4">
                <h4 className="font-mono text-sm text-muted-foreground">EXISTING_USERS</h4>
                <ul className="text-sm font-mono mt-2 space-y-1">
                  {users.map((u) => (
                    <li key={u.email} className="text-foreground">{u.email}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-xl">CHANGE_PASSWORD</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...changePwdForm}>
                <form onSubmit={changePwdForm.handleSubmit(onChangePassword)} className="space-y-4">
                  <FormField
                    control={changePwdForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">EMAIL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={changePwdForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">CURRENT_PASSWORD</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={changePwdForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs">NEW_PASSWORD</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-background border-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary">UPDATE_PASSWORD</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
            </section>
            )}

            {section === "messages" && (
            <section>
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-xl">MESSAGES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-mono">NO_MESSAGES</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id || m._id} className="p-4 border border-primary/20 rounded-lg">
                      <div className="text-sm font-mono text-primary">{m.name} &lt;{m.email}&gt;</div>
                      <div className="text-xs text-muted-foreground">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
                      <div className="mt-2 text-sm">{m.message}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
            </section>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
