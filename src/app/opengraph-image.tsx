import { ImageResponse } from "next/og";

export const alt = "WhoToVoteFor — Match your views to UK party manifestos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fbfaf7",
          color: "#161616",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#0e7c7b",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          UK General Election 2024
        </div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 1.05,
            fontFamily: "ui-serif, Georgia, serif",
            maxWidth: 980,
          }}
        >
          Who should you vote&nbsp;for?
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: "#6b6963",
          }}
        >
          <span>Match your views to the parties&apos; manifestos.</span>
          <span style={{ color: "#161616", fontWeight: 600 }}>
            WhoToVoteFor<span style={{ color: "#0e7c7b" }}>.</span>
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
