import { z } from 'zod';
import { releases, tracks, features, changeRequests, artists } from './schema';

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ password: z.string() }),
      responses: {
        200: z.object({
          success: z.boolean(),
          redirectUrl: z.string().optional(),
          error: z.string().optional()
        })
      }
    }
  },
  artists: {
    get: {
      method: 'GET' as const,
      path: '/api/artists/:artistId',
      responses: {
        200: z.custom<typeof artists.$inferSelect>()
      }
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/artists/:artistId',
      input: z.object({
        name: z.string().optional(),
        image: z.string().optional()
      }),
      responses: {
        200: z.custom<typeof artists.$inferSelect>()
      }
    }
  },
  releases: {
    list: {
      method: 'GET' as const,
      path: '/api/releases/:artistId',
      responses: {
        200: z.array(z.custom<typeof releases.$inferSelect>())
      }
    },
    getTracks: {
      method: 'GET' as const,
      path: '/api/releases/:releaseId/tracks',
      responses: {
        200: z.array(z.custom<typeof tracks.$inferSelect>())
      }
    }
  },
  tracks: {
    getFeatures: {
      method: 'GET' as const,
      path: '/api/tracks/:trackId/features',
      responses: {
        200: z.array(z.custom<typeof features.$inferSelect>())
      }
    }
  },
  changeRequests: {
    create: {
      method: 'POST' as const,
      path: '/api/change-requests',
      input: z.object({
        releaseId: z.number(),
        trackId: z.number().optional(),
        changeType: z.string(),
        description: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof changeRequests.$inferSelect>()
      }
    },
    uploadFile: {
      method: 'POST' as const,
      path: '/api/change-requests/upload',
      responses: {
        201: z.object({
          id: z.number(),
          filePath: z.string(),
          message: z.string()
        })
      }
    }
  }
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
