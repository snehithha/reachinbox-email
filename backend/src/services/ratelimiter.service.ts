import redis from "../config/redis";

const MAX_EMAILS_PER_HOUR =
  Number(process.env.MAX_EMAILS_PER_HOUR) || 200;

function getCurrentHourKey(sender: string) {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hour = String(now.getUTCHours()).padStart(2, "0");

  return `email-limit:${sender}:${year}-${month}-${day}-${hour}`;
}

export async function canSendEmail(sender: string) {
  const key = getCurrentHourKey(sender);

  const result = await redis.eval(
    `
      local current = tonumber(redis.call("GET", KEYS[1]) or "0")

      if current >= tonumber(ARGV[1]) then
          return 0
      end

      current = redis.call("INCR", KEYS[1])

      if current == 1 then
          redis.call("EXPIRE", KEYS[1], 7200)
      end

      return 1
    `,
    1,
    key,
    MAX_EMAILS_PER_HOUR.toString()
  );

  return result === 1;
}

export function getDelayUntilNextHour() {
  const now = new Date();

  const nextHour = new Date(now);
  nextHour.setUTCMinutes(0);
  nextHour.setUTCSeconds(0);
  nextHour.setUTCMilliseconds(0);

  nextHour.setUTCHours(nextHour.getUTCHours() + 1);

  return nextHour.getTime() - now.getTime();
}