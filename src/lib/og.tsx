import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

interface OgInput {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

async function loadFonts() {
  const directory = join(process.cwd(), "src/assets/og");
  const [display, sans] = await Promise.all([
    readFile(join(directory, "fraunces-600.woff")),
    readFile(join(directory, "hanken-500.woff")),
  ]);
  return [
    { name: "Fraunces", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Hanken", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

export async function renderOgImage({ eyebrow, title, subtitle, badge }: OgInput): Promise<ImageResponse> {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #1d1220 0%, #3b1631 55%, #6e2a57 100%)",
          color: "#f7f1e8",
          fontFamily: "Hanken",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#7a2d60",
                border: "2px solid rgba(247,241,232,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Fraunces",
                fontSize: 34,
              }}
            >
              S
            </div>
            <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 36 }}>
              Steevanz<span style={{ color: "#e9c685" }}>.</span>
            </div>
          </div>
          {badge ? (
            <div
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 999,
                background: "#e9c685",
                color: "#1d1220",
                fontSize: 28,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#e9c685" }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: title.length > 48 ? 64 : 76, lineHeight: 1.05 }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: "rgba(247,241,232,0.78)" }}>{subtitle}</div>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 24, color: "rgba(247,241,232,0.7)" }}>
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: "#e9c685" }} />
          steevanz.com
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
