import { api } from "@shared/routes";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";
import { useToast } from "./use-toast";
import type { 
  Skill, 
  Experience, 
  Education, 
  Certification, 
  InsertContactMessage, 
  ContactMessage,
  Profile,
  InsertProfile,
  Blog,
  InsertBlog
} from "@shared/schema";

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: [api.skills.list.path],
  });
}

export function useExperience() {
  return useQuery<Experience[]>({
    queryKey: [api.experience.list.path],
  });
}

export function useEducation() {
  return useQuery<Education[]>({
    queryKey: [api.education.list.path],
  });
}

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: [api.certifications.list.path],
  });
}

export function useBlogs() {
  return useQuery<Blog[]>({
    queryKey: [api.blogs.list.path],
  });
}

export function useCreateBlog() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (blog: InsertBlog) => {
      const res = await apiRequest(api.blogs.create.method, api.blogs.create.path, blog);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] });
      toast({ title: "Intelligence report published" });
    },
  });
}

export function useProfile() {
  return useQuery<Profile>({
    queryKey: [api.profile.get.path],
  });
}

export function useUpdateProfile() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (updates: Partial<InsertProfile>) => {
      const res = await apiRequest("PATCH", api.profile.update.path, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profile.get.path] });
      toast({ title: "Profile updated successfully" });
    },
  });
}

export function useUploadProfile() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.profile.upload.path, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload files");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profile.get.path] });
      toast({ title: "Files uploaded successfully" });
    },
  });
}

export function useContactMessage() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (message: InsertContactMessage) => {
      const res = await fetch(api.contact.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Signal transmitted successfully", description: "I'll get back to you soon." });
    },
  });
}
