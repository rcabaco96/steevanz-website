/**
 * «Ligar Google» shows as «Em breve» in the panel (owner, 2026-10-11) until Google approves the
 * Business Profile API access for the project. Since the same day the Google page shows it to
 * admins too, with a notice that Google is verifying Steevanz; admins can still test by opening
 * /api/google/connect?slug=<slug> directly (the route refuses everyone else). Flip to false to open it to every customer.
 */
export const googleConnectComingSoon = true;
