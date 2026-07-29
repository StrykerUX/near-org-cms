import { createHmac } from "crypto";
import { UAParser } from "ua-parser-js";

const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|discordbot|slackbot|preview|headless|curl|wget|python-requests|axios|monitor/i;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_UA_PATTERN.test(userAgent);
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const secret = process.env.AUTH_SECRET || "linktree-fallback-secret";
  return createHmac("sha256", secret).update(ip).digest("hex");
}

export interface ParsedUserAgent {
  browser: string | null;
  os: string | null;
  deviceType: string;
}

export function parseUserAgent(userAgent: string | null | undefined): ParsedUserAgent {
  if (!userAgent) {
    return { browser: null, os: null, deviceType: "desktop" };
  }
  const result = new UAParser(userAgent).getResult();
  return {
    browser: result.browser.name ?? null,
    os: result.os.name ?? null,
    deviceType: result.device.type ?? "desktop",
  };
}
