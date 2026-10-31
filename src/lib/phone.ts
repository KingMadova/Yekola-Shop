/**
 * Numéros congolais : 9 chiffres (avec le 0 initial) après l'indicatif 242.
 * Accepte "06 123 4567", "+242 06 123 4567", "00242061234567".
 * Retourne "242061234567" ou null si le numéro est invalide.
 */
export function normalizeCongoPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9) digits = `242${digits}`;
  return /^242\d{9}$/.test(digits) ? digits : null;
}
