/**
 * Cloudflare Turnstile verification. Disabled unless TURNSTILE_ENABLED=true
 * and a secret key is present, so the form keeps working out of the box.
 */
export function turnstileEnabled(): boolean {
  return process.env.TURNSTILE_ENABLED === 'true' && Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (typeof token !== 'string' || token.trim() === '') return false;

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY as string,
      response: token,
      remoteip: ip,
    });

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });

    const result = (await response.json()) as { success?: boolean };
    return Boolean(result.success);
  } catch {
    return false;
  }
}
