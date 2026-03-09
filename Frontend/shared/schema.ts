import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  proficiency: integer("proficiency").default(100),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description").notNull(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  year: text("year").notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer"),
  year: text("year"),
  certificateUrl: text("certificate_url"),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  avatarUrl: text("avatar_url"),
  cvUrl: text("cv_url"),
  faviconUrl: text("favicon_url"),
  linkedin: text("linkedin").default("https://www.linkedin.com/in/elbortbista"),
  githubUrl: text("github_url"),
  twitterUrl: text("twitter_url"),
  email: text("email").default("elbortbista@gmail.com"),
  heroBadge: text("hero_badge").default("SYSTEM SECURE"),
  heroNamePrimary: text("hero_name_primary").default("ELBORT."),
  heroNameAccent: text("hero_name_accent").default("BISTA"),
  heroRoles: text("hero_roles").default("Offensive Security Researcher|Penetration Tester|Vulnerability Analyst|Python Developer"),
  heroBio: text("hero_bio").default("I break systems to make them stronger. Dedicated to identifying vulnerabilities and securing digital infrastructure against evolving cyber threats."),
  footerTagline: text("footer_tagline").default("Securing digital landscapes through offensive security research and proactive risk mitigation."),
  yearsExperience: integer("years_experience").default(2),
  projectsSecured: integer("projects_secured").default(10),
  majorCertifications: integer("major_certifications").default(4),
  happyClients: integer("happy_clients").default(0),
  footerCopyright: text("footer_copyright").default("© {year} ELBORT.BISTA. All systems operational."),
  hideHeroButtons: boolean("hide_hero_buttons").default(false),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experience).omit({ id: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export const insertCertificationSchema = createInsertSchema(certifications).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertBlogSchema = createInsertSchema(blogs).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Experience = typeof experience.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
