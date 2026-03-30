import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const WIDTH = 1920;
const HEIGHT = 1080;

const Title: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        fontSize: 72,
        fontWeight: 800,
        color: "#2f4f87",
        opacity,
        letterSpacing: 2,
      }}
    >
      WEB APPLICATION LAYERS
    </div>
  );
};

const BrowserIcon: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="3" width="22" height="16" rx="2" fill="#ffffff" stroke="#2f6fb0" />
    <rect x="3" y="5" width="18" height="3" rx="1" fill="#2f6fb0" />
  </svg>
);

const DbIcon: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="6" rx="7" ry="3" fill="#ffffff" stroke="#2f6fb0" />
    <path d="M5 6v6c0 1.657 3.134 3 7 3s7-1.343 7-3V6" fill="#ffffff" stroke="#2f6fb0" />
  </svg>
);

const FileIcon: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="12" height="18" rx="2" fill="#ffffff" stroke="#2f6fb0" />
    <path d="M16 3v6h6" stroke="#2f6fb0" />
  </svg>
);

const IsometricLayer: React.FC<{
  left: number;
  yBase: number;
  width: number;
  depth?: number;
  thickness?: number;
  colorTop: string;
  colorLeft: string;
  colorFront: string;
  label: React.ReactNode;
  frame: number;
  startFrame: number;
  accent?: string;
}> = ({ left, yBase, width, depth = 140, thickness = 34, colorTop, colorLeft, colorFront, label, frame, startFrame, accent }) => {
  const slide = interpolate(
    frame,
    [startFrame, startFrame + 40],
    [-360, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 20, 260, 300],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // isometric projection offsets (~30deg)
  const dx = depth * 0.866025403; // cos(30)
  const dy = depth * 0.5; // sin(30)

  const margin = 20;

  const p1 = { x: margin, y: 0 };
  const p2 = { x: margin + width, y: 0 };
  const p3 = { x: margin + width + dx, y: dy };
  const p4 = { x: margin + dx, y: dy };

  const p1b = { x: p1.x, y: p1.y + thickness };
  const p2b = { x: p2.x, y: p2.y + thickness };
  const p3b = { x: p3.x, y: p3.y + thickness };
  const p4b = { x: p4.x, y: p4.y + thickness };

  const viewW = Math.ceil(p3.x + margin);
  const viewH = Math.ceil(p3.y + thickness + margin + 10);

  const shadowCx = p1.x + (width + dx) / 2;
  const shadowCy = p3.y + thickness + 26;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: yBase + slide,
        width: viewW,
        height: viewH,
        opacity,
        pointerEvents: "none",
      }}
    >
      <svg width={viewW} height={viewH} viewBox={`0 0 ${viewW} ${viewH}`}>
        <ellipse cx={shadowCx} cy={shadowCy} rx={(width + dx) / 2} ry={20} fill="rgba(10,30,80,0.14)" />

        {/* top face */}
        <polygon
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
          fill={colorTop}
        />

        {/* left face */}
        <polygon
          points={`${p1.x},${p1.y} ${p4.x},${p4.y} ${p4b.x},${p4b.y} ${p1b.x},${p1b.y}`}
          fill={colorLeft}
        />

        {/* front/right face */}
        <polygon
          points={`${p2.x},${p2.y} ${p3.x},${p3.y} ${p3b.x},${p3b.y} ${p2b.x},${p2b.y}`}
          fill={colorFront}
        />

        {/* accent stripe along the front slanted edge */}
        {accent ? (
          <line
            x1={p2.x}
            y1={p2.y}
            x2={p3.x}
            y2={p3.y}
            stroke={accent}
            strokeWidth={10}
            strokeLinecap="round"
          />
        ) : null}
      </svg>

      {/* Overlay label and icons positioned relative to the top face */}
      <div style={{ position: "absolute", left: 0, top: 0, width: viewW, height: viewH }}>
        <div
          style={{
            position: "absolute",
            left: p1.x + 32,
            top: p1.y + 18,
            color: "#07203b",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export const WebApplicationLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // composition timing
  const durationInFrames = 300; // 10 seconds at 30fps

  // start times for the stacked shapes (after title fade-in)
  const starts = [30, 70, 110, 150];

  // center coordinates
  const compWidth = WIDTH;
  const compHeight = HEIGHT;

  const boxWidth = 700;
  const boxHeight = 120;

  const centerX = compWidth / 2 - boxWidth / 2;
  const baseY = 260; // top-most layer base Y

  const globalFade = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#e8f3ff" }}>
      <AbsoluteFill style={{ opacity: globalFade }}>
        <Title frame={frame} />

        {/* Storage layer (drawn first - bottom) */}
        <IsometricLayer
          left={centerX + 40}
          yBase={baseY + 240}
          width={boxWidth}
          depth={220}
          thickness={40}
          colorTop="#0f4b82"
          colorLeft="#0b375a"
          colorFront="#06253e"
          label={<div style={{ display: "flex", alignItems: "center", gap: 12 }}><DbIcon/> Relational • NoSQL</div>}
          frame={frame}
          startFrame={starts[3]}
        />

        {/* Business Logic */}
        <IsometricLayer
          left={centerX + 20}
          yBase={baseY + 160}
          width={boxWidth}
          depth={200}
          thickness={38}
          colorTop="#2f6fb0"
          colorLeft="#265984"
          colorFront="#1f4e73"
          label={<div>Business Logic / NodeJS</div>}
          frame={frame}
          startFrame={starts[2]}
        />

        {/* API Layer */}
        <IsometricLayer
          left={centerX}
          yBase={baseY + 80}
          width={boxWidth}
          depth={180}
          thickness={36}
          colorTop="#7fb6ff"
          colorLeft="#5e9de0"
          colorFront="#3c82d6"
          label={<div>API Layer — Business Logic Layer</div>}
          frame={frame}
          startFrame={starts[1]}
        />

        {/* Top layer - FRONT-END with a yellow edge accent (drawn last so it appears on top) */}
        <IsometricLayer
          left={centerX - 40}
          yBase={baseY}
          width={boxWidth}
          depth={160}
          thickness={34}
          colorTop="#cfe9ff"
          colorLeft="#a9d9ff"
          colorFront="#7fb6ff"
          accent="#f5c23b"
          label={
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <BrowserIcon />
              <div style={{ color: "#0d2b4a" }}>FRONT-END (Client-side)</div>
            </div>
          }
          frame={frame}
          startFrame={starts[0]}
        />

        {/* Small bottom badge */}
        <div
          style={{
            position: "absolute",
            left: compWidth / 2 - 28,
            top: baseY + 420,
            width: 56,
            height: 56,
            borderRadius: 12,
            background: "#2473c0",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            boxShadow: "0 10px 20px rgba(10,30,80,0.18)",
            opacity: interpolate(frame, [starts[3], starts[3] + 40, 260, 300], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          DJ
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default WebApplicationLayers;
