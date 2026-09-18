import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-static";

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTitle = searchParams.get("title") ?? "Reza Barzakhi";
    const title = rawTitle.length > 110 ? `${rawTitle.slice(0, 110)}…` : rawTitle;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            background: "linear-gradient(135deg, #1a2332 0%, #27374d 100%)",
            fontFamily: "sans-serif",
            color: "#dde6ed",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 42,
              fontWeight: 800,
              color: "#9db2bf",
              letterSpacing: 1,
            }}
          >
            &lt;RB/&gt;
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 88,
                height: 6,
                borderRadius: 999,
                background: "#526d82",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              {title}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              fontSize: 28,
              color: "#9db2bf",
            }}
          >
            <span>rezabarzakhi.ir</span>
            <span>Reza Barzakhi</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}