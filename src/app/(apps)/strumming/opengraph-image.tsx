import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Strumming Pattern Trainer | Guitar Companion";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            🎸
          </div>
          <span style={{ fontSize: "32px", fontWeight: "bold", color: "#f8fafc" }}>
            Guitar Companion
          </span>
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: "900",
            letterSpacing: "-0.03em",
            textAlign: "center",
            margin: "0 0 16px 0",
            background: "linear-gradient(90deg, #ffffff 0%, #f59e0b 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Strumming Pattern Trainer
        </h1>

        <p
          style={{
            fontSize: "26px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            margin: 0,
          }}
        >
          Interactive visual timeline with synchronized precision metronome, beginner presets, and customizable subdivisions.
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["↓", "↓", "↑", "↓", "↑"].map((arrow, idx) => (
            <div
              key={idx}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: "#334155",
                border: "2px solid #06b6d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: "bold",
                color: "#38bdf8",
              }}
            >
              {arrow}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
