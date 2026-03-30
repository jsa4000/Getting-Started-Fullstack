import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface TypewriterProps {
  text: string;
  startFrame?: number;
  charsPerSecond?: number;
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  startFrame = 0,
  charsPerSecond = 18,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.floor((elapsed / fps) * charsPerSecond);
  const visible = text.slice(0, charsToShow);
  return <span style={style}>{visible}</span>;
};
