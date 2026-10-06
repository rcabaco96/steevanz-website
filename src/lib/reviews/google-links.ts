/**
 * Links to Google. Pure module so it can be tested with node --test.
 */

const reviewIdPattern = /^[A-Za-z0-9_-]{10,300}$/;
const fidPattern = /^0x[0-9a-f]{1,16}:0x[0-9a-f]{1,16}$/i;

/**
 * Opens one review on Google Maps (the owner, signed in, can reply there). Built from the review
 * id and the place's "fid" (both come with every review we import); null when either is missing
 * or malformed, so callers fall back to the place's page.
 */
export function googleReviewUrl(reviewId: string, fid: string | null): string | null {
  if (!fid || !fidPattern.test(fid) || !reviewIdPattern.test(reviewId)) return null;
  return `https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1s${reviewId}!2m1!1s${fid}!3m1!1s2@1:${reviewId}?hl=pt-PT`;
}
