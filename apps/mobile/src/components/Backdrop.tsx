import { memo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Defs, Pattern, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors } from "@/theme";

interface Glow {
  id: string;
  color: string;
  cx: number;
  cy: number;
  r: number;
}

export const Backdrop = memo(() => {
  const { width, height } = useWindowDimensions();
  const w = Math.max(width, 360);
  const h = Math.max(height, 640);
  const glows: Glow[] = [
    { id: "g1", color: colors.blobLavender, cx: w * 0.1, cy: h * 0.05, r: w * 0.75 },
    { id: "g2", color: colors.blobPeach, cx: w * 0.95, cy: h * 0.3, r: w * 0.6 },
    { id: "g3", color: colors.blobMint, cx: w * 0.15, cy: h * 0.85, r: w * 0.65 },
    { id: "g4", color: colors.blobSky, cx: w * 0.85, cy: h * 0.95, r: w * 0.55 },
  ];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={w} height={h}>
        <Defs>
          <Pattern id="dots" patternUnits="userSpaceOnUse" width={22} height={22}>
            <Circle cx={11} cy={11} r={1.3} fill={colors.dot} opacity={0.55} />
          </Pattern>
          {glows.map((g) => (
            <RadialGradient key={g.id} id={g.id} cx={g.cx} cy={g.cy} r={g.r} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={g.color} stopOpacity={0.95} />
              <Stop offset="1" stopColor={g.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        <Rect width={w} height={h} fill={colors.ground} />
        {glows.map((g) => (
          <Rect key={g.id} width={w} height={h} fill={`url(#${g.id})`} />
        ))}
        <Rect width={w} height={h} fill="url(#dots)" />
      </Svg>
    </View>
  );
});
