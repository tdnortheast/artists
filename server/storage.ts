import { db } from "./db";
import { 
  releases, 
  tracks, 
  features, 
  changeRequests,
  artists,
  type Release, 
  type Track, 
  type Feature,
  type ChangeRequest,
  type Artist,
  type InsertRelease,
  type InsertTrack,
  type InsertFeature,
  type InsertChangeRequest,
  type InsertArtist
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getArtist(artistId: string): Promise<Artist | undefined>;
  updateArtist(artistId: string, data: { name?: string; image?: string }): Promise<Artist>;
  getReleases(artistId: string): Promise<Release[]>;
  createRelease(release: InsertRelease): Promise<Release>;
  getTracks(releaseId: number): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  getFeatures(trackId: number): Promise<Feature[]>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  createChangeRequest(request: InsertChangeRequest): Promise<ChangeRequest>;
  seed(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getArtist(artistId: string): Promise<Artist | undefined> {
    const result = await db.select().from(artists).where(eq(artists.id, artistId));
    return result[0];
  }

  async updateArtist(artistId: string, data: { name?: string; image?: string }): Promise<Artist> {
    const [updated] = await db.update(artists)
      .set(data)
      .where(eq(artists.id, artistId))
      .returning();
    return updated;
  }

  async getReleases(artistId: string): Promise<Release[]> {
    return await db.select().from(releases).where(eq(releases.artistId, artistId));
  }

  async createRelease(release: InsertRelease): Promise<Release> {
    const [newRelease] = await db.insert(releases).values(release).returning();
    return newRelease;
  }

  async getTracks(releaseId: number): Promise<Track[]> {
    return await db.select().from(tracks)
      .where(eq(tracks.releaseId, releaseId))
      .orderBy(tracks.id);
  }

  async createTrack(track: InsertTrack): Promise<Track> {
    const [newTrack] = await db.insert(tracks).values(track).returning();
    return newTrack;
  }

  async getFeatures(trackId: number): Promise<Feature[]> {
    return await db.select().from(features).where(eq(features.trackId, trackId));
  }

  async createFeature(feature: InsertFeature): Promise<Feature> {
    const [newFeature] = await db.insert(features).values(feature).returning();
    return newFeature;
  }

  async createChangeRequest(request: InsertChangeRequest): Promise<ChangeRequest> {
    const [newRequest] = await db.insert(changeRequests).values(request).returning();
    return newRequest;
  }

  async seed(): Promise<void> {
    try {
      const existingArtists = await db.select().from(artists);
      if (existingArtists.length === 0) {
        // Create artists
        await db.insert(artists).values([
          {
            id: "artist1",
            name: "Yuno $weez",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
          },
          {
            id: "artist2",
            name: "J@M@R",
            image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
          }
        ]);
      }

      const existingReleases = await db.select().from(releases);
      if (existingReleases.length === 0) {
        // Create Weezcity album for artist1
        const weezcity = await this.createRelease({
          albumId: "weezcity_2025",
          artistId: "artist1",
          title: "Weezcity",
          year: 2025,
          type: "album",
          coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"
        });

        const weezcityTracks = [
          { title: "fatimah", explicit: false },
          { title: "DONOTRUNUPONME!", explicit: true },
          { title: "Beamer", explicit: false, features: ["Yuno Benz"] },
          { title: "Issey Miyake", explicit: false },
          { title: "Oxycodone", explicit: true, features: ["JBEETLE"] },
          { title: "SUNDAYMORNINGCHURCH", explicit: false, features: ["Jadi"] },
          { title: "Let Me Interlude", explicit: false },
          { title: "Law F*ck Order", explicit: true },
          { title: "Purple Drank", explicit: true },
          { title: "Givenchy", explicit: false }
        ];

        for (const t of weezcityTracks) {
          const track = await this.createTrack({
            releaseId: weezcity.id,
            title: t.title,
            explicit: t.explicit
          });
          if (t.features) {
            for (const f of t.features) {
              await this.createFeature({ trackId: track.id, artistName: f });
            }
          }
        }

        // Create releases for artist1
        const yunoAlbum1 = await this.createRelease({
          albumId: "yuno_nocturnal_2023",
          artistId: "artist1",
          title: "Nocturnal Sessions",
          year: 2023,
          type: "album",
          coverUrl: "https://images.unsplash.com/photo-1611339555312-e607c04352fd?w=400&h=400&fit=crop"
        });

        const yunoTrack1 = await this.createTrack({
          releaseId: yunoAlbum1.id,
          title: "Midnight Vibe",
          explicit: true
        });

        const yunoTrack2 = await this.createTrack({
          releaseId: yunoAlbum1.id,
          title: "Electric Dreams",
          explicit: false
        });

        await this.createFeature({
          trackId: yunoTrack1.id,
          artistName: "Juice WRLD"
        });

        const yunoSingle = await this.createRelease({
          albumId: "yuno_neon_2024",
          artistId: "artist1",
          title: "Neon Nights",
          year: 2024,
          type: "single",
          coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
        });

        const yunoSingleTrack = await this.createTrack({
          releaseId: yunoSingle.id,
          title: "Neon Nights",
          explicit: true
        });

        // Create releases for artist2
        const jamarAlbum1 = await this.createRelease({
          albumId: "jamar_urban_2023",
          artistId: "artist2",
          title: "Urban Chronicles",
          year: 2023,
          type: "album",
          coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        });

        const jamarTrack1 = await this.createTrack({
          releaseId: jamarAlbum1.id,
          title: "Street Poetry",
          explicit: true
        });

        const jamarTrack2 = await this.createTrack({
          releaseId: jamarAlbum1.id,
          title: "City Lights",
          explicit: false
        });

        await this.createFeature({
          trackId: jamarTrack1.id,
          artistName: "A Boogie"
        });

        const jamarSingle = await this.createRelease({
          albumId: "jamar_block_2024",
          artistId: "artist2",
          title: "Block Party",
          year: 2024,
          type: "single",
          coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
        });

        const jamarSingleTrack = await this.createTrack({
          releaseId: jamarSingle.id,
          title: "Block Party",
          explicit: false
        });
      }
    } catch (error) {
      console.error("Seed error:", error);
    }
  }
}

export const storage = new DatabaseStorage();
