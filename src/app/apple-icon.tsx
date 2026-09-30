import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7a2d60",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path
            d="M10.5 12.5a5.5 5.5 0 0 1 0 7M14.5 10a9 9 0 0 1 0 12M18.5 7.5a12.5 12.5 0 0 1 0 17"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="10" r="2.2" fill="#cfa563" />
        </svg>
      </div>
    ),
    size,
  );
}
