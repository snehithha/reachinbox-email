import redis from "../config/redis";

const MIN_EMAIL_DELAY =
  Number(process.env.MIN_EMAIL_DELAY) || 2000;

const THROTTLE_KEY = "email:next-send-time";

/**
 * Atomically reserve the next available send slot.
 * Returns the exact timestamp when this email may be sent.
 */
export async function reserveSendSlot(): Promise<number> {
  const now = Date.now();

  const slot = await redis.eval(
    `
      local key = KEYS[1]
      local delay = tonumber(ARGV[1])
      local now = tonumber(ARGV[2])

      local next = tonumber(redis.call("GET", key) or "0")

      if next < now then
          next = now
      end

      redis.call("SET", key, next + delay)

      return next
    `,
    1,
    THROTTLE_KEY,
    MIN_EMAIL_DELAY.toString(),
    now.toString()
  );

  return Number(slot);
}