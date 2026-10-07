import QRCode from "qrcode";

/** A QR code drawn on the server as SVG (crisp when printed). */
export async function QrCode({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const svg = await QRCode.toString(value, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#1d1220", light: "#ffffff" } });
  return <div role="img" aria-label={label} className={`[&>svg]:h-full [&>svg]:w-full ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
