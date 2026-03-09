import { z } from 'zod';
import { 
  insertContactMessageSchema,
  insertProfileSchema,
  insertBlogSchema,
  skills,
  experience,
  education,
  certifications,
  contactMessages,
  profile,
  blogs
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills' as const,
      responses: {
        200: z.array(z.custom<typeof skills.$inferSelect>()),
      },
    },
  },
  experience: {
    list: {
      method: 'GET' as const,
      path: '/api/experience' as const,
      responses: {
        200: z.array(z.custom<typeof experience.$inferSelect>()),
      },
    },
  },
  education: {
    list: {
      method: 'GET' as const,
      path: '/api/education' as const,
      responses: {
        200: z.array(z.custom<typeof education.$inferSelect>()),
      },
    },
  },
  certifications: {
    list: {
      method: 'GET' as const,
      path: '/api/certifications' as const,
      responses: {
        200: z.array(z.custom<typeof certifications.$inferSelect>()),
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact' as const,
      input: insertContactMessageSchema,
      responses: {
        201: z.custom<typeof contactMessages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile' as const,
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/profile' as const,
      input: insertProfileSchema.partial(),
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
      },
    },
    upload: {
      method: 'POST' as const,
      path: '/api/profile/upload' as const,
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
      },
    },
  },
  blogs: {
    list: {
      method: 'GET' as const,
      path: '/api/blogs' as const,
      responses: {
        200: z.array(z.custom<typeof blogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/blogs' as const,
      input: insertBlogSchema,
      responses: {
        201: z.custom<typeof blogs.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
