import { createClient } from "redis";

const redis = createClient({
  url: process.env["REDIS_URL"]
});
const conn = redis.connect();

export async function getCount(nanoid?: string) {
  await conn;
  if (nanoid !== undefined) {
    await redis.hSet("count", nanoid, new Date().getTime());
  }
  const count = await redis.hLen("count");
  return count;
}
