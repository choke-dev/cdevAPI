import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

const env = await load();
let sql: ReturnType<typeof postgres> | null;

if (!env["DATABASE_HOST"]) {
    console.log("[WARN] No database host found, database service is unavailable.");
    sql = null;
} else {
    sql = postgres({
        host     : env["DATABASE_HOST"],
        port     : 5432,
        database : env["DATABASE_NAME"],
        username : env["DATABASE_USER"],
        password : env["DATABASE_PASSWORD"],
    });
}

export { sql }