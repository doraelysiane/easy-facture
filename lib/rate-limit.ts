import { headers } from 'next/headers';

// Un simple store en mémoire pour le rate limiting
// (Note: En production sur Vercel, cela fonctionnera par instance lambda. Pour un blocage global strict, il faudrait Redis/Upstash)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

/**
 * Vérifie si la limite de requêtes a été atteinte pour l'IP actuelle.
 * @param actionName Le nom de l'action pour isoler les limites (ex: "login", "forgot_password")
 * @param limit Le nombre maximum de requêtes autorisées
 * @param windowMs La fenêtre de temps en millisecondes avant réinitialisation
 */
export async function checkRateLimit(actionName: string, limit: number = 5, windowMs: number = 60000) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip';
  const key = `${ip}-${actionName}`;

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetTime < now) {
    // Si pas de record ou si la fenêtre est passée, on réinitialise
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    // Limite atteinte
    const remainingTime = Math.ceil((record.resetTime - now) / 1000);
    return { 
      success: false, 
      error: `Trop de requêtes. Veuillez réessayer dans ${remainingTime} secondes.` 
    };
  }

  // On incrémente
  record.count += 1;
  return { success: true };
}
