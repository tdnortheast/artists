import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const artists = pgTable("artists", {
  id: text("id").primaryKey(), // 'artist1', 'artist2'
  name: text("name").notNull(),
  image: text("image"),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  albumId: text("album_id").notNull(),
  artistId: text("artist_id").notNull(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull(),
  coverUrl: text("cover_url"),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").notNull(),
  title: text("title").notNull(),
  explicit: boolean("explicit").default(false),
});

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").notNull(),
  artistName: text("artist_name").notNull(),
});

export const changeRequests = pgTable("change_requests", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").notNull(),
  trackId: integer("track_id"),
  changeType: text("change_type").notNull(),
  description: text("description"),
  filePath: text("file_path"),
  status: text("status").default("pending"),
});

export const insertArtistSchema = createInsertSchema(artists).omit({ id: true });
export const insertReleaseSchema = createInsertSchema(releases).omit({ id: true });
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true });
export const insertFeatureSchema = createInsertSchema(features).omit({ id: true });
export const insertChangeRequestSchema = createInsertSchema(changeRequests).omit({ id: true });

export type Artist = typeof artists.$inferSelect;
export type Release = typeof releases.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Feature = typeof features.$inferSelect;
export type ChangeRequest = typeof changeRequests.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type InsertRelease = z.infer<typeof insertReleaseSchema>;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type InsertChangeRequest = z.infer<typeof insertChangeRequestSchema>;
