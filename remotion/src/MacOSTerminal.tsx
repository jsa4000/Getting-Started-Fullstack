import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Typewriter } from "./Typewriter";

export interface MacTerminalProps {
  width?: number;
  height?: number;
  theme?: "light" | "dark";
  showCursor?: boolean;
  rotateX?: number;
}

const macTitleBarHeight = 36;
const terminalBorder = "#e0e0e0";
const terminalFont = "Menlo, Monaco, 'Fira Mono', 'Liberation Mono', 'Consolas', monospace";
const terminalTextColor = "#222";
const terminalBarColor = "#ededed";
const terminalBtnRed = "#ff5f56";
const terminalBtnYellow = "#ffbd2e";
const terminalBtnGreen = "#27c93f";

export const MacOSTerminal: React.FC<MacTerminalProps> = ({
  width = 1280,
  height = 1000,
  theme = "light",
  showCursor = true,
  rotateX = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Blinking cursor: 0.5s on, 0.5s off
  const blink = Math.floor((frame / (fps / 2)) % 2) === 0;
  // theme colors
  const isDark = theme === "dark";
  const containerBg = isDark ? "#0b1220" : "transparent";
  const textColor = isDark ? "#e6eef8" : terminalTextColor;
  const titleBarTextColor = isDark ? "#aeb8c6" : "#888";
  const titleBarBg = isDark ? "#0f1620" : terminalBarColor;

  // Animate Y rotation from 10deg to -10deg across the whole composition
  const rotateYAnimated = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [10, -10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Slide from bottom using a spring (no bounce): progress 0 -> 1
  const slideProgress = spring({
    fps,
    frame,
    config: {
      damping: 200,
      stiffness: 120,
      mass: 1,
    },
  });

  const translateY = (1 - slideProgress) * height; // start at `height`, end at 0

  const rotationTransform = `translateY(${translateY}px) perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateYAnimated}deg)`;

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        background: containerBg,
        borderRadius: 12,
        boxShadow: isDark ? "0 30px 60px rgba(2,6,23,0.6)" : "none",
        border: isDark ? "1px solid rgba(255,255,255,0.03)" : "none",
        overflow: "hidden",
        fontFamily: terminalFont,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        transform: rotationTransform,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
    >
      {/* Title Bar */}
      <div
          style={{
          height: macTitleBarHeight,
          background: titleBarBg,
          borderBottom: `1px solid ${terminalBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, background: terminalBtnRed, borderRadius: "50%" }} />
          <div style={{ width: 12, height: 12, background: terminalBtnYellow, borderRadius: "50%" }} />
          <div style={{ width: 12, height: 12, background: terminalBtnGreen, borderRadius: "50%" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 500, fontSize: 15, color: titleBarTextColor }}>
          Terminal
        </div>
      </div>
      {/* Terminal Content */}
      <div
        style={{
          flex: 1,
          padding: "32px 40px",
          fontSize: 38,
          lineHeight: 1.7,
          letterSpacing: 0.1,
          background: "transparent",
          minHeight: 0,
          position: "relative",
        }}
      >
        <span style={{ color: "#007aff", fontWeight: 600 }}>
          jsantosa
        </span>
        <span style={{ color: "#222" }}>@</span>
        <span style={{ color: "#007aff", fontWeight: 600 }}>MacBook-Pro</span>
        <span style={{ color: "#222" }}>:~ % </span>
        <Typewriter
          text={"npx skills add remotion-dev/skills"}
          startFrame={0}
          charsPerSecond={18}
          style={{ color: textColor }}
        />
        {showCursor && (
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 28,
              background: blink ? textColor : "transparent",
              marginLeft: 2,
              verticalAlign: "middle",
              borderRadius: 2,
              // No CSS transition, Remotion animates via useCurrentFrame
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
