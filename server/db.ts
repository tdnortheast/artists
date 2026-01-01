import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: "postgresql://authenticated@ep-sweet-river-ae87aive.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" 
});
export const db = drizzle(pool, { schema });
