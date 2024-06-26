import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

const localEnv = await load();

export function getEnv(key: string) {
    return localEnv[key] || Deno.env.get(key);
}