/**
 * How long the sign-in, confirmation and password links in our emails last. It must match
 * Supabase Auth's «Email OTP expiration» (mailer_otp_exp, 3600 seconds = 1 hora); see
 * docs/auth-email-config.md. Change both together.
 */
export const authLinkValidity = "1 hora";

export const authLinkValidityText = `Este link é válido durante ${authLinkValidity} e só pode ser usado uma vez.`;
