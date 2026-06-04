import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("t") ?? "家電を、横並びで選ぶ。";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "#1a1a1a",
          padding: "56px 64px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #c2410c, #f97316, #d97706)",
            borderRadius: "2px",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "54px",
              height: "54px",
              background: "#c2410c",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            KE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "22px", fontWeight: "bold" }}>
              Kaden Erabi Lab
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              家電えらび研究室
            </span>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ color: "#f97316", fontSize: "18px" }}>
            実機評価・横並び比較メディア
          </span>
          <span
            style={{
              color: "#ffffff",
              fontSize: title.length > 22 ? "40px" : "50px",
              fontWeight: "bold",
              lineHeight: "1.3",
              maxWidth: "1020px",
            }}
          >
            {title}
          </span>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "100px",
              padding: "8px 18px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "15px",
            }}
          >
            ✓ 評価軸を公開
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "100px",
              padding: "8px 18px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "15px",
            }}
          >
            ✓ 更新日を明記
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "100px",
              padding: "8px 18px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "15px",
            }}
          >
            ✓ 広告主優遇なし
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
