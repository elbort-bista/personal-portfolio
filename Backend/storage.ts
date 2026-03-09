import { skills, experience, education, certifications, contactMessages, profile, blogs, users, type User, type InsertUser } from "@shared/schema";
import { type InsertContactMessage, type ContactMessage, type Skill, type Experience, type Education, type Certification, type Profile, type InsertProfile, type Blog, type InsertBlog } from "@shared/schema";
import { type InsertSkill, type InsertExperience, type InsertEducation, type InsertCertification } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

export interface IStorage {
  getSkills(): Promise<Skill[]>;
  getExperience(): Promise<Experience[]>;
  getEducation(): Promise<Education[]>;
  getCertifications(): Promise<Certification[]>;
  getBlogs(): Promise<Blog[]>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog>;
  deleteBlog(id: number): Promise<void>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: number, updates: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: number): Promise<void>;
  createEducation(ed: InsertEducation): Promise<Education>;
  updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: number): Promise<void>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification>;
  deleteCertification(id: number): Promise<void>;
  getProfile(): Promise<Profile>;
  updateProfile(updates: Partial<InsertProfile>): Promise<Profile>;
  seedData(): Promise<void>;
  getUserByEmail(email: string): Promise<{ email: string } | null>;
  listUsers(): Promise<Array<{ id: number; email: string }>>;
  getUserById(id: number): Promise<User | null>;
  addUser(email: string, password: string): Promise<void>;
  deleteUser(id: number): Promise<void>;
  changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean>;
  validateCredentials(email: string, password: string): Promise<boolean>;
}

// Database-backed storage using Drizzle
import { db } from "./db";

export class DatabaseStorage implements IStorage {
  async getSkills(): Promise<Skill[]> {
    return await (db as any).select().from(skills as any) as Skill[];
  }

  async getExperience(): Promise<Experience[]> {
    return await (db as any).select().from(experience as any) as Experience[];
  }

  async getEducation(): Promise<Education[]> {
    return await (db as any).select().from(education as any) as Education[];
  }

  async getCertifications(): Promise<Certification[]> {
    return await (db as any).select().from(certifications as any) as Certification[];
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [row] = await (db as any).insert(skills as any).values(skill as any).returning();
    return row;
  }
  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const [row] = await (db as any).update(skills as any).set(updates as any).where(eq((skills as any).id, id)).returning();
    return row;
  }
  async deleteSkill(id: number): Promise<void> {
    await (db as any).delete(skills as any).where(eq((skills as any).id, id));
  }
  async createExperience(exp: InsertExperience): Promise<Experience> {
    const [row] = await (db as any).insert(experience as any).values(exp as any).returning();
    return row;
  }
  async updateExperience(id: number, updates: Partial<InsertExperience>): Promise<Experience> {
    const [row] = await (db as any).update(experience as any).set(updates as any).where(eq((experience as any).id, id)).returning();
    return row;
  }
  async deleteExperience(id: number): Promise<void> {
    await (db as any).delete(experience as any).where(eq((experience as any).id, id));
  }
  async createEducation(ed: InsertEducation): Promise<Education> {
    const [row] = await (db as any).insert(education as any).values(ed as any).returning();
    return row;
  }
  async updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education> {
    const [row] = await (db as any).update(education as any).set(updates as any).where(eq((education as any).id, id)).returning();
    return row;
  }
  async deleteEducation(id: number): Promise<void> {
    await (db as any).delete(education as any).where(eq((education as any).id, id));
  }
  async createCertification(cert: InsertCertification): Promise<Certification> {
    const [row] = await (db as any).insert(certifications as any).values(cert as any).returning();
    return row;
  }
  async updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification> {
    const [row] = await (db as any).update(certifications as any).set(updates as any).where(eq((certifications as any).id, id)).returning();
    return row;
  }
  async deleteCertification(id: number): Promise<void> {
    await (db as any).delete(certifications as any).where(eq((certifications as any).id, id));
  }
  async getBlogs(): Promise<Blog[]> {
    return await (db as any).select().from(blogs as any).orderBy(desc((blogs as any).createdAt)) as Blog[];
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const [newBlog] = await (db as any)
      .insert(blogs as any)
      .values({
        ...blog,
        excerpt: (blog as any).excerpt ?? (blog as any).content?.slice(0, 220),
        published: (blog as any).published ?? true,
      })
      .returning();
    return newBlog;
  }
  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog> {
    const [row] = await (db as any).update(blogs as any).set(updates as any).where(eq((blogs as any).id, id)).returning();
    return row;
  }
  async deleteBlog(id: number): Promise<void> {
    await (db as any).delete(blogs as any).where(eq((blogs as any).id, id));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await (db as any).insert(contactMessages as any).values(message as any).returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await (db as any).select().from(contactMessages as any).orderBy(desc((contactMessages as any).createdAt)) as ContactMessage[];
  }

  async getProfile(): Promise<Profile> {
    const [p] = await (db as any).select().from(profile as any);
    if (!p) {
      const [newP] = await (db as any).insert(profile as any).values({}).returning();
      return newP;
    }
    return p;
  }

  async updateProfile(updates: Partial<InsertProfile>): Promise<Profile> {
    const p = await this.getProfile();
    const [updated] = await (db as any).update(profile as any)
      .set(updates as any)
      .where(eq((profile as any).id, p.id))
      .returning();
    return updated;
  }

  async seedData(): Promise<void> {
    const existingSkills = await this.getSkills();
    if (existingSkills.length === 0) {
      await (db as any).insert(skills as any).values([
        { name: "Python", category: "Technical" },
        { name: "Java", category: "Technical" },
        { name: "Web Application Security", category: "Technical" },
        { name: "OWASP Top 10", category: "Technical" },
      ]);

      await (db as any).insert(certifications as any).values([
        { name: "CompTIA Security+", year: "2024", certificateUrl: "https://example.com/cert1" },
        { name: "Certified Cyber Evasion Professional (CCEP)", year: "2024", certificateUrl: "https://example.com/cert2" },
      ]);

      await (db as any).insert(blogs as any).values([
        {
          title: "The Art of Offensive Security",
          content: "In this briefing, we explore the core methodologies used by offensive security researchers to identify zero-day vulnerabilities in modern web applications. From reconnaissance to exploitation, we cover the full lifecycle of an attack.",
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        },
        {
          title: "Securing Financial Infrastructure",
          content: "Banking and financial systems are high-value targets. This post discusses the specific security controls and audit patterns required to protect transaction integrity and prevent unauthorized access to core banking systems.",
          imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
        }
      ]);

      await (db as any).insert(experience as any).values([
        {
          title: "Security Analyst",
          company: "Cube Technologies Pvt. Ltd.",
          location: "Kathmandu, Nepal",
          startDate: "July 2025",
          endDate: "Present",
          description: "Enhancing security measures."
        }
      ]);

      await (db as any).insert(education as any).values([
        {
          degree: "Bachelor Of Computer Science",
          institution: "Lincoln University College",
          year: "2021 - 2025"
        }
      ]);
      
      await this.getProfile();
    }
    const existingUsers = await (db as any).select().from(users as any);
    if (!existingUsers || existingUsers.length === 0) {
      const email = process.env.ADMIN_EMAIL || "admin@local";
      const password = process.env.ADMIN_PASSWORD || "admin123";
      await this.addUser(email, password);
    }
  }

  async getUserByEmail(email: string): Promise<{ email: string } | null> {
    const [u] = await (db as any).select().from(users as any).where(eq((users as any).email, email));
    return u ? { email: u.email } : null;
  }
  async listUsers(): Promise<Array<{ id: number; email: string }>> {
    return await (db as any).select({ id: (users as any).id, email: (users as any).email }).from(users as any);
  }
  async getUserById(id: number): Promise<User | null> {
    const [u] = await (db as any).select().from(users as any).where(eq((users as any).id, id));
    return u || null;
  }
  async addUser(email: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    await (db as any).insert(users as any).values({ email, passwordHash });
  }
  async deleteUser(id: number): Promise<void> {
    await (db as any).delete(users as any).where(eq((users as any).id, id));
  }
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const [u] = await (db as any).select().from(users as any).where(eq((users as any).email, email));
    if (!u) return false;
    const ok = await bcrypt.compare(currentPassword, u.passwordHash);
    if (!ok) return false;
    const newHash = await bcrypt.hash(newPassword, 10);
    await (db as any).update(users as any).set({ passwordHash: newHash }).where(eq((users as any).email, email));
    return true;
  }
  async validateCredentials(email: string, password: string): Promise<boolean> {
    const [u] = await (db as any).select().from(users as any).where(eq((users as any).email, email));
    if (!u) return false;
    return await bcrypt.compare(password, u.passwordHash);
  }
}

// In-memory fallback storage for local development without a DATABASE_URL
class MemoryStorage implements IStorage {
  private _skills: Skill[] = [];
  private _experience: Experience[] = [];
  private _education: Education[] = [];
  private _certifications: Certification[] = [];
  private _blogs: Blog[] = [];
  private _profile: Profile | null = null;
  private _users: Array<{ email: string; passwordHash: string }> = [];
  private _bcrypt?: typeof import("bcryptjs");
  private _messages: ContactMessage[] = [];

  async getSkills(): Promise<Skill[]> {
    return this._skills;
  }

  async getExperience(): Promise<Experience[]> {
    return this._experience;
  }

  async getEducation(): Promise<Education[]> {
    return this._education;
  }

  async getCertifications(): Promise<Certification[]> {
    return this._certifications;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const row: Skill = { id: (this._skills.length + 1) as any, proficiency: skill.proficiency ?? (100 as any), ...skill } as any;
    this._skills.push(row);
    return row;
  }
  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const idx = this._skills.findIndex((s: any) => s.id === id);
    this._skills[idx] = { ...(this._skills[idx] as any), ...updates } as any;
    return this._skills[idx];
  }
  async deleteSkill(id: number): Promise<void> {
    this._skills = this._skills.filter((s: any) => s.id !== id);
  }
  async createExperience(exp: InsertExperience): Promise<Experience> {
    const row: Experience = { id: (this._experience.length + 1) as any, ...exp } as any;
    this._experience.push(row);
    return row;
  }
  async updateExperience(id: number, updates: Partial<InsertExperience>): Promise<Experience> {
    const idx = this._experience.findIndex((e: any) => e.id === id);
    this._experience[idx] = { ...(this._experience[idx] as any), ...updates } as any;
    return this._experience[idx];
  }
  async deleteExperience(id: number): Promise<void> {
    this._experience = this._experience.filter((e: any) => e.id !== id);
  }
  async createEducation(ed: InsertEducation): Promise<Education> {
    const row: Education = { id: (this._education.length + 1) as any, ...ed } as any;
    this._education.push(row);
    return row;
  }
  async updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education> {
    const idx = this._education.findIndex((e: any) => e.id === id);
    this._education[idx] = { ...(this._education[idx] as any), ...updates } as any;
    return this._education[idx];
  }
  async deleteEducation(id: number): Promise<void> {
    this._education = this._education.filter((e: any) => e.id !== id);
  }
  async createCertification(cert: InsertCertification): Promise<Certification> {
    const row: Certification = { id: (this._certifications.length + 1) as any, ...cert } as any;
    this._certifications.push(row);
    return row;
  }
  async updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification> {
    const idx = this._certifications.findIndex((c: any) => c.id === id);
    this._certifications[idx] = { ...(this._certifications[idx] as any), ...updates } as any;
    return this._certifications[idx];
  }
  async deleteCertification(id: number): Promise<void> {
    this._certifications = this._certifications.filter((c: any) => c.id !== id);
  }
  async getBlogs(): Promise<Blog[]> {
    return this._blogs.sort((a, b) => (b.createdAt! > a.createdAt! ? 1 : -1));
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const newBlog: Blog = {
      id: (this._blogs.length + 1) as any,
      createdAt: new Date() as any,
      title: blog.title,
      excerpt: (blog as any).excerpt ?? (blog as any).content?.slice(0, 220),
      content: blog.content,
      imageUrl: (blog as any).imageUrl ?? null,
      published: (blog as any).published ?? true,
    };
    this._blogs.push(newBlog);
    return newBlog;
  }
  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog> {
    const idx = this._blogs.findIndex((b: any) => b.id === id);
    this._blogs[idx] = { ...(this._blogs[idx] as any), ...updates } as any;
    return this._blogs[idx];
  }
  async deleteBlog(id: number): Promise<void> {
    this._blogs = this._blogs.filter((b: any) => b.id !== id);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: (Math.random() * 1e9) as any,
      createdAt: new Date() as any,
      ...message,
    };
    this._messages.push(newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return this._messages ?? [];
  }

  async getProfile(): Promise<Profile> {
    if (!this._profile) {
      const newP: Profile = {
        id: (1 as any),
        avatarUrl: null as any,
        cvUrl: null as any,
        faviconUrl: null as any,
        linkedin: "https://www.linkedin.com/in/elbortbista" as any,
        githubUrl: null as any,
        twitterUrl: null as any,
        email: "elbortbista@gmail.com" as any,
        heroBadge: "SYSTEM SECURE" as any,
        heroNamePrimary: "ELBORT." as any,
        heroNameAccent: "BISTA" as any,
        heroRoles: "Offensive Security Researcher|Penetration Tester|Vulnerability Analyst|Python Developer" as any,
        heroBio: "I break systems to make them stronger. Dedicated to identifying vulnerabilities and securing digital infrastructure against evolving cyber threats." as any,
        footerTagline: "Securing digital landscapes through offensive security research and proactive risk mitigation." as any,
        yearsExperience: (2 as any),
        projectsSecured: (10 as any),
        majorCertifications: (4 as any),
        happyClients: (0 as any),
        footerCopyright: "© {year} ELBORT.BISTA. All systems operational." as any,
        hideHeroButtons: (false as any),
      };
      this._profile = newP;
    }
    return this._profile!;
  }

  async updateProfile(updates: Partial<InsertProfile>): Promise<Profile> {
    const current = await this.getProfile();
    this._profile = { ...current, ...updates } as Profile;
    return this._profile!;
  }

  private async ensureBcrypt() {
    if (!this._bcrypt) {
      const mod = await import("bcryptjs");
      // support both ESM/CJS interop
      this._bcrypt = (mod as any).default && (mod as any).default.hash ? ((mod as any).default as any) : (mod as any);
    }
    return this._bcrypt!;
  }

  async getUserByEmail(email: string): Promise<{ email: string } | null> {
    const u = this._users.find((x) => x.email === email);
    return u ? { email: u.email } : null;
  }

  async listUsers(): Promise<Array<{ id: number; email: string }>> {
    return this._users.map((u, idx) => ({ id: idx + 1, email: u.email }));
  }

  async getUserById(id: number): Promise<User | null> {
    const u = this._users[id - 1];
    if (!u) return null;
    return { id, email: u.email, passwordHash: u.passwordHash, createdAt: new Date() } as User;
  }

  async deleteUser(id: number): Promise<void> {
    this._users.splice(id - 1, 1);
  }

  async addUser(email: string, password: string): Promise<void> {
    const bcrypt = await this.ensureBcrypt();
    const hash = await bcrypt.hash(password, 10);
    const existing = this._users.find((x) => x.email === email);
    if (existing) {
      existing.passwordHash = hash;
    } else {
      this._users.push({ email, passwordHash: hash });
    }
  }

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const bcrypt = await this.ensureBcrypt();
    const u = this._users.find((x) => x.email === email);
    if (!u) return false;
    const ok = await bcrypt.compare(currentPassword, u.passwordHash);
    if (!ok) return false;
    u.passwordHash = await bcrypt.hash(newPassword, 10);
    return true;
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const bcrypt = await this.ensureBcrypt();
    const u = this._users.find((x) => x.email === email);
    if (!u) return false;
    return await bcrypt.compare(password, u.passwordHash);
  }

  async seedData(): Promise<void> {
    if (this._skills.length === 0) {
      this._skills = [
        { id: (1 as any), name: "Python", category: "Technical", proficiency: 100 as any },
        { id: (2 as any), name: "Java", category: "Technical", proficiency: 100 as any },
        { id: (3 as any), name: "Web Application Security", category: "Technical", proficiency: 100 as any },
        { id: (4 as any), name: "OWASP Top 10", category: "Technical", proficiency: 100 as any },
      ];

      this._certifications = [
        { id: (1 as any), name: "CompTIA Security+", issuer: null as any, year: "2024", certificateUrl: "https://example.com/cert1" },
        { id: (2 as any), name: "Certified Cyber Evasion Professional (CCEP)", issuer: null as any, year: "2024", certificateUrl: "https://example.com/cert2" },
      ];

      this._blogs = [
        {
          id: (1 as any),
          title: "The Art of Offensive Security",
          excerpt: "In this briefing, we explore the core methodologies used by offensive security researchers...",
          content: "In this briefing, we explore the core methodologies used by offensive security researchers to identify zero-day vulnerabilities in modern web applications. From reconnaissance to exploitation, we cover the full lifecycle of an attack.",
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
          published: true as any,
          createdAt: new Date() as any,
        },
        {
          id: (2 as any),
          title: "Securing Financial Infrastructure",
          excerpt: "Banking and financial systems are high-value targets. This post discusses key controls...",
          content: "Banking and financial systems are high-value targets. This post discusses the specific security controls and audit patterns required to protect transaction integrity and prevent unauthorized access to core banking systems.",
          imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
          published: true as any,
          createdAt: new Date() as any,
        },
      ];

      this._experience = [
        {
          id: (1 as any),
          title: "Security Analyst",
          company: "Cube Technologies Pvt. Ltd.",
          location: "Kathmandu, Nepal",
          startDate: "July 2025",
          endDate: "Present",
          description: "Enhancing security measures.",
        },
      ];

      this._education = [
        {
          id: (1 as any),
          degree: "Bachelor Of Computer Science",
          institution: "Lincoln University College",
          year: "2021 - 2025",
        },
      ];

      await this.getProfile();
    }
    // Ensure a default admin user for initial login if none exist
    if (this._users.length === 0) {
      await this.addUser("admin@local", "admin123");
    }
  }
}

export const storage: IStorage =
  process.env.MONGODB_URI
    ? new (class MongoStorage implements IStorage {
        client: MongoClient;
        dbName: string;
        connected = false;
        private _bcrypt?: typeof import("bcryptjs");
        private async oid(id: any) {
          const { ObjectId } = await import("mongodb");
          try {
            return new ObjectId(String(id));
          } catch {
            return null;
          }
        }
        constructor(uri: string) {
          this.client = new MongoClient(uri);
          this.dbName = process.env.MONGODB_DB || "elbortbista";
        }
        async _col(name: string): Promise<any> {
          if (!this.connected) {
            await this.client.connect();
            this.connected = true;
          }
          return this.client.db(this.dbName).collection(name);
        }
        private async ensureBcrypt() {
          if (!this._bcrypt) {
            const mod = await import("bcryptjs");
            this._bcrypt = (mod as any).default && (mod as any).default.hash ? ((mod as any).default as any) : (mod as any);
          }
          return this._bcrypt!;
        }
        async getSkills(): Promise<Skill[]> {
          const col = await this._col("skills");
          return await col.find({}).toArray();
        }
        async getExperience(): Promise<Experience[]> {
          const col = await this._col("experience");
          return await col.find({}).toArray();
        }
        async getEducation(): Promise<Education[]> {
          const col = await this._col("education");
          return await col.find({}).toArray();
        }
        async getCertifications(): Promise<Certification[]> {
          const col = await this._col("certifications");
          return await col.find({}).toArray();
        }
        async createSkill(skill: InsertSkill): Promise<Skill> {
          const col = await this._col("skills");
          const res = await col.insertOne(skill as any);
          return { id: (res.insertedId as any), proficiency: skill.proficiency ?? (100 as any), ...skill } as any;
        }
        async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
          const col = await this._col("skills");
          const _id = await this.oid(id);
          await col.updateOne(_id ? { _id } : { id }, { $set: updates });
          const doc = await col.findOne(_id ? { _id } : { id });
          return doc as any;
        }
        async deleteSkill(id: number): Promise<void> {
          const col = await this._col("skills");
          const _id = await this.oid(id);
          await col.deleteOne(_id ? { _id } : { id });
        }
        async createExperience(exp: InsertExperience): Promise<Experience> {
          const col = await this._col("experience");
          const res = await col.insertOne(exp as any);
          return { id: (res.insertedId as any), ...exp } as any;
        }
        async updateExperience(id: number, updates: Partial<InsertExperience>): Promise<Experience> {
          const col = await this._col("experience");
          const _id = await this.oid(id);
          await col.updateOne(_id ? { _id } : { id }, { $set: updates });
          const doc = await col.findOne(_id ? { _id } : { id });
          return doc as any;
        }
        async deleteExperience(id: number): Promise<void> {
          const col = await this._col("experience");
          const _id = await this.oid(id);
          await col.deleteOne(_id ? { _id } : { id });
        }
        async createEducation(ed: InsertEducation): Promise<Education> {
          const col = await this._col("education");
          const res = await col.insertOne(ed as any);
          return { id: (res.insertedId as any), ...ed } as any;
        }
        async updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education> {
          const col = await this._col("education");
          const _id = await this.oid(id);
          await col.updateOne(_id ? { _id } : { id }, { $set: updates });
          const doc = await col.findOne(_id ? { _id } : { id });
          return doc as any;
        }
        async deleteEducation(id: number): Promise<void> {
          const col = await this._col("education");
          const _id = await this.oid(id);
          await col.deleteOne(_id ? { _id } : { id });
        }
        async createCertification(cert: InsertCertification): Promise<Certification> {
          const col = await this._col("certifications");
          const res = await col.insertOne(cert as any);
          return { id: (res.insertedId as any), ...cert } as any;
        }
        async updateCertification(id: number, updates: Partial<InsertCertification>): Promise<Certification> {
          const col = await this._col("certifications");
          const _id = await this.oid(id);
          await col.updateOne(_id ? { _id } : { id }, { $set: updates });
          const doc = await col.findOne(_id ? { _id } : { id });
          return doc as any;
        }
        async deleteCertification(id: number): Promise<void> {
          const col = await this._col("certifications");
          const _id = await this.oid(id);
          await col.deleteOne(_id ? { _id } : { id });
        }
        async getBlogs(): Promise<Blog[]> {
          const col = await this._col("blogs");
          return await col.find({}).sort({ createdAt: -1 }).toArray();
        }
        async createBlog(blog: InsertBlog): Promise<Blog> {
          const col = await this._col("blogs");
          const doc = {
            ...blog,
            excerpt: (blog as any).excerpt ?? (blog as any).content?.slice(0, 220),
            published: (blog as any).published ?? true,
            createdAt: new Date(),
          } as any;
          const res = await col.insertOne(doc);
          return { ...(doc as any), id: (res.insertedId as any) } as Blog;
        }
        async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog> {
          const col = await this._col("blogs");
          const _id = await this.oid(id);
          await col.updateOne(_id ? { _id } : { id }, { $set: updates });
          const doc = await col.findOne(_id ? { _id } : { id });
          return doc as any;
        }
        async deleteBlog(id: number): Promise<void> {
          const col = await this._col("blogs");
          const _id = await this.oid(id);
          await col.deleteOne(_id ? { _id } : { id });
        }
        async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
          const col = await this._col("contact_messages");
          const doc = { ...message, createdAt: new Date() } as any;
          const res = await col.insertOne(doc);
          return { ...(doc as any), id: (res.insertedId as any) } as ContactMessage;
        }
        async getContactMessages(): Promise<ContactMessage[]> {
          const col = await this._col("contact_messages");
          return await col.find({}).sort({ createdAt: -1 }).toArray();
        }
        async getProfile(): Promise<Profile> {
          const col = await this._col("profile");
          const p = await col.findOne({});
          if (!p) {
            const seed = {
              avatarUrl: null as any,
              cvUrl: null as any,
              linkedin: "https://www.linkedin.com/in/elbortbista" as any,
              githubUrl: null as any,
              twitterUrl: null as any,
              email: "elbortbista@gmail.com" as any,
              heroBadge: "SYSTEM SECURE" as any,
              heroNamePrimary: "ELBORT." as any,
              heroNameAccent: "BISTA" as any,
              heroRoles: "Offensive Security Researcher|Penetration Tester|Vulnerability Analyst|Python Developer" as any,
              heroBio: "I break systems to make them stronger. Dedicated to identifying vulnerabilities and securing digital infrastructure against evolving cyber threats." as any,
              footerTagline: "Securing digital landscapes through offensive security research and proactive risk mitigation." as any,
            } as Profile;
            await col.insertOne(seed as any);
            return seed;
          }
          return p as Profile;
        }
        async updateProfile(updates: Partial<InsertProfile>): Promise<Profile> {
          const col = await this._col("profile");
          const p = await col.findOne({});
          if (!p) {
            await col.insertOne(updates as any);
            return updates as any;
          }
          await col.updateOne({ _id: (p as any)._id }, { $set: updates });
          return { ...(p as any), ...(updates as any) } as Profile;
        }
        async seedData(): Promise<void> {
          const skillsCol = await this._col("skills");
          const count = await skillsCol.countDocuments();
          if (count === 0) {
            await skillsCol.insertMany([
              { name: "Python", category: "Technical", proficiency: 100 } as any,
              { name: "Java", category: "Technical", proficiency: 100 } as any,
              { name: "Web Application Security", category: "Technical", proficiency: 100 } as any,
              { name: "OWASP Top 10", category: "Technical", proficiency: 100 } as any,
            ]);
            const certsCol = await this._col("certifications");
            await certsCol.insertMany([
              { name: "CompTIA Security+", year: "2024", certificateUrl: "https://example.com/cert1" } as any,
              { name: "Certified Cyber Evasion Professional (CCEP)", year: "2024", certificateUrl: "https://example.com/cert2" } as any,
            ]);
            const blogsCol = await this._col("blogs");
            await blogsCol.insertMany([
              {
                title: "The Art of Offensive Security",
                content: "In this briefing, we explore the core methodologies used by offensive security researchers to identify zero-day vulnerabilities in modern web applications. From reconnaissance to exploitation, we cover the full lifecycle of an attack.",
                imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
                createdAt: new Date(),
              } as any,
              {
                title: "Securing Financial Infrastructure",
                content: "Banking and financial systems are high-value targets. This post discusses the specific security controls and audit patterns required to protect transaction integrity and prevent unauthorized access to core banking systems.",
                imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
                createdAt: new Date(),
              } as any,
            ]);
            const expCol = await this._col("experience");
            await expCol.insertOne({
              title: "Security Analyst",
              company: "Cube Technologies Pvt. Ltd.",
              location: "Kathmandu, Nepal",
              startDate: "July 2025",
              endDate: "Present",
              description: "Enhancing security measures.",
            } as any);
            const eduCol = await this._col("education");
            await eduCol.insertOne({
              degree: "Bachelor Of Computer Science",
              institution: "Lincoln University College",
              year: "2021 - 2025",
            } as any);
            await this.getProfile();
          }
        }
        async getUserByEmail(email: string): Promise<{ email: string } | null> {
          const col = await this._col("users");
          const u = await col.findOne({ email });
          return u ? { email: u.email } : null;
        }
        async listUsers(): Promise<Array<{ id: number; email: string }>> {
          const col = await this._col("users");
          const arr = await col.find({}).toArray();
          return arr.map((x: any) => ({ id: x.id || x._id, email: x.email }));
        }
        async getUserById(id: number): Promise<User | null> {
          const col = await this._col("users");
          const _id = await this.oid(id);
          const u = await col.findOne(_id ? { _id } : { id });
          return u as any;
        }
        async deleteUser(id: number): Promise<void> {
          const col = await this._col("users");
          const _id = await this.oid(id);
          await col.deleteOne(_id ? { _id } : { id });
        }
        async addUser(email: string, password: string): Promise<void> {
          const bcrypt = await this.ensureBcrypt();
          const col = await this._col("users");
          const hash = await bcrypt.hash(password, 10);
          await col.updateOne({ email }, { $set: { email, passwordHash: hash, createdAt: new Date() } }, { upsert: true });
        }
        async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
          const bcrypt = await this.ensureBcrypt();
          const col = await this._col("users");
          const u = await col.findOne({ email });
          if (!u) return false;
          const ok = await bcrypt.compare(currentPassword, u.passwordHash);
          if (!ok) return false;
          const newHash = await bcrypt.hash(newPassword, 10);
          await col.updateOne({ email }, { $set: { passwordHash: newHash } });
          return true;
        }
        async validateCredentials(email: string, password: string): Promise<boolean> {
          const bcrypt = await this.ensureBcrypt();
          const col = await this._col("users");
          const u = await col.findOne({ email });
          if (!u) return false;
          return await bcrypt.compare(password, u.passwordHash);
        }
      })(process.env.MONGODB_URI as string)
    : process.env.DATABASE_URL
    ? new DatabaseStorage()
    : new MemoryStorage();
