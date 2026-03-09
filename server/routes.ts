import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import passport from "passport";
import { insertSkillSchema, insertExperienceSchema, insertEducationSchema, insertCertificationSchema } from "@shared/schema";

const uploadsDir =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public", "uploads")
    : path.resolve("client", "public", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

// uploadsDir already ensured above

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await storage.seedData();

  function requireAuth(req: any, res: any, next: any) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.logIn(user, (err: any) => {
        if (err) return next(err);
        return res.json({ email: user.email });
      });
    })(req, res, next);
  });

  app.get("/api/me", (req: any, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.json({ email: req.user.email });
    }
    return res.status(401).json({ message: "Unauthorized" });
  });

  app.post("/api/logout", (req: any, res, next) => {
    req.logout((err: any) => {
      if (err) return next(err);
      return res.json({ ok: true });
    });
  });

  app.get(api.profile.get.path, async (_req, res) => {
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.patch(api.profile.update.path, requireAuth, async (req, res) => {
    const updates = api.profile.update.input.parse(req.body);
    const profile = await storage.updateProfile(updates);
    res.json(profile);
  });

  app.post(api.profile.upload.path, requireAuth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cv', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), async (req: any, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const updates: any = {};
    
    if (files.avatar?.[0]) {
      updates.avatarUrl = `/uploads/${files.avatar[0].filename}`;
    }
    if (files.cv?.[0]) {
      updates.cvUrl = `/uploads/${files.cv[0].filename}`;
    }
    if (files.favicon?.[0]) {
      updates.faviconUrl = `/uploads/${files.favicon[0].filename}`;
    }
    
    const profile = await storage.updateProfile(updates);
    res.json(profile);
  });

  app.get(api.skills.list.path, async (_req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });
  app.post("/api/skills", requireAuth, async (req, res) => {
    const input = insertSkillSchema.parse(req.body);
    const row = await storage.createSkill(input);
    res.status(201).json(row);
  });
  app.patch("/api/skills/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const updates = insertSkillSchema.partial().parse(req.body);
    const row = await storage.updateSkill(id, updates);
    res.json(row);
  });
  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteSkill(id);
    res.json({ ok: true });
  });

  app.get(api.experience.list.path, async (_req, res) => {
    const experience = await storage.getExperience();
    res.json(experience);
  });
  app.post("/api/experience", requireAuth, async (req, res) => {
    const input = insertExperienceSchema.parse(req.body);
    const row = await storage.createExperience(input);
    res.status(201).json(row);
  });
  app.patch("/api/experience/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const updates = insertExperienceSchema.partial().parse(req.body);
    const row = await storage.updateExperience(id, updates);
    res.json(row);
  });
  app.delete("/api/experience/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteExperience(id);
    res.json({ ok: true });
  });

  app.get(api.education.list.path, async (_req, res) => {
    const education = await storage.getEducation();
    res.json(education);
  });
  app.post("/api/education", requireAuth, async (req, res) => {
    const input = insertEducationSchema.parse(req.body);
    const row = await storage.createEducation(input);
    res.status(201).json(row);
  });
  app.patch("/api/education/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const updates = insertEducationSchema.partial().parse(req.body);
    const row = await storage.updateEducation(id, updates);
    res.json(row);
  });
  app.delete("/api/education/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteEducation(id);
    res.json({ ok: true });
  });

  app.get(api.certifications.list.path, async (_req, res) => {
    const certifications = await storage.getCertifications();
    res.json(certifications);
  });
  app.post("/api/certifications", requireAuth, async (req, res) => {
    const input = insertCertificationSchema.parse(req.body);
    const row = await storage.createCertification(input);
    res.status(201).json(row);
  });
  app.patch("/api/certifications/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const updates = insertCertificationSchema.partial().parse(req.body);
    const row = await storage.updateCertification(id, updates);
    res.json(row);
  });
  app.delete("/api/certifications/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteCertification(id);
    res.json({ ok: true });
  });

  app.get(api.blogs.list.path, async (req: any, res) => {
    const all = await storage.getBlogs();
    const authed = req.isAuthenticated && req.isAuthenticated();
    const visible = authed ? all : all.filter((b: any) => (b as any).published !== false);
    res.json(visible);
  });

  app.get("/api/blogs/:id", async (req: any, res) => {
    const id = Number(req.params.id);
    const all = await storage.getBlogs();
    const authed = req.isAuthenticated && req.isAuthenticated();
    const blog = all.find((b: any) => (b as any).id === id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    if (!authed && (blog as any).published === false) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(blog);
  });

  app.post(api.blogs.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.blogs.create.input.extend({ published: z.boolean().optional() }).parse(req.body);
      const blog = await storage.createBlog(input);
      res.status(201).json(blog);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post("/api/blogs/upload-image", requireAuth, upload.single("file"), async (req: any, res) => {
    if (!req.file) return res.status(400).json({ message: "File missing" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  app.patch("/api/blogs/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const updates = z
      .object({
        title: z.string().optional(),
        excerpt: z.string().optional().nullable(),
        content: z.string().optional(),
        imageUrl: z.string().optional().nullable(),
        published: z.boolean().optional(),
      })
      .parse(req.body);
    const row = await storage.updateBlog(id, updates);
    res.json(row);
  });

  app.delete("/api/blogs/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteBlog(id);
    res.json({ ok: true });
  });

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get("/api/messages", requireAuth, async (_req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.get("/api/users", requireAuth, async (_req, res) => {
    const users = await storage.listUsers();
    res.json(users);
  });

  const addUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  app.post("/api/users", requireAuth, async (req, res) => {
    const input = addUserSchema.parse(req.body);
    await storage.addUser(input.email, input.password);
    res.status(201).json({ ok: true });
  });

  const changePasswordSchema = z.object({
    email: z.string().email(),
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  });
  app.post("/api/users/change-password", requireAuth, async (req, res) => {
    const input = changePasswordSchema.parse(req.body);
    const ok = await storage.changePassword(
      input.email,
      input.currentPassword,
      input.newPassword,
    );
    if (!ok) {
      return res.status(400).json({ message: "Invalid current password" });
    }
    res.json({ ok: true });
  });

  app.get("/api/stats", requireAuth, async (_req, res) => {
    const [messages, blogs, skills, experience, certifications, education, users] =
      await Promise.all([
        storage.getContactMessages(),
        storage.getBlogs(),
        storage.getSkills(),
        storage.getExperience(),
        storage.getCertifications(),
        storage.getEducation(),
        storage.listUsers(),
      ]);
    res.json({
      messages: messages.length,
      blogs: blogs.length,
      skills: skills.length,
      experience: experience.length,
      certifications: certifications.length,
      education: education.length,
      users: users.length,
    });
  });

  return httpServer;
}
