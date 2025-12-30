import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Release } from "@shared/schema";
import { useLocation } from "wouter";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Fetch releases for a specific artist
export function useReleases(artistId: string) {
  return useQuery({
    queryKey: [api.releases.list.path, artistId],
    queryFn: async () => {
      const url = buildUrl(api.releases.list.path, { artistId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch releases");
      return api.releases.list.responses[200].parse(await res.json());
    },
    enabled: !!artistId,
  });
}

// Fetch tracks for a specific release
export function useTracks(releaseId: number | null) {
  return useQuery({
    queryKey: [api.releases.getTracks.path, releaseId],
    queryFn: async () => {
      if (!releaseId) return [];
      const url = buildUrl(api.releases.getTracks.path, { releaseId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tracks");
      return api.releases.getTracks.responses[200].parse(await res.json());
    },
    enabled: !!releaseId,
  });
}

// Fetch features for a specific track
export function useFeatures(trackId: number | null) {
  return useQuery({
    queryKey: [api.tracks.getFeatures.path, trackId],
    queryFn: async () => {
      if (!trackId) return [];
      const url = buildUrl(api.tracks.getFeatures.path, { trackId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch features");
      return api.tracks.getFeatures.responses[200].parse(await res.json());
    },
    enabled: !!trackId,
  });
}

// Handle login logic
export function useLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (password: string) => {
      const validated = api.auth.login.input.parse({ password });
      
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        throw new Error("Invalid password");
      }

      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      if (data.success && data.redirectUrl) {
        toast({
          title: "Access Granted",
          description: "Welcome back.",
        });
        setLocation(data.redirectUrl);
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: data.error || "Incorrect password",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    },
  });
}

// Submit change request
export function useCreateChangeRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { releaseId: number; trackId?: number; changeType: string; description?: string; filePath?: string }) => {
      const res = await fetch(api.changeRequests.create.path, {
        method: api.changeRequests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit change request");
      }

      return api.changeRequests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your request has been submitted.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit request",
      });
    },
  });
}

// Upload file for change request
export function useUploadFile() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { fileData: string; fileName: string; changeType: string }) => {
      const res = await fetch(api.changeRequests.uploadFile.path, {
        method: api.changeRequests.uploadFile.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      return api.changeRequests.uploadFile.responses[201].parse(await res.json());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error.message || "Failed to upload file",
      });
    },
  });
}
