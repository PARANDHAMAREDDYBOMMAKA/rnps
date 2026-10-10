import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { clay, colors, fonts } from "@/theme";

interface LogoProps {
  size?: number;
  wordmark?: boolean;
  light?: boolean;
}

const steps = [
  { id: "s0", tone: clay.lavender, x: 9, y: 37, h: 17 },
  { id: "s1", tone: clay.butter, x: 25, y: 26, h: 28 },
  { id: "s2", tone: clay.mint, x: 41, y: 13, h: 41 },
];

export const LogoMark = ({ size = 40, tile = true }: { size?: number; tile?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Defs>
      <LinearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F6F3FF" />
        <Stop offset="1" stopColor="#DCD4FA" />
      </LinearGradient>
      <RadialGradient id="tileGlow" cx="0.3" cy="0.2" r="0.9">
        <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
        <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
      </RadialGradient>
      {steps.map((s) => (
        <LinearGradient key={s.id} id={s.id} x1="0" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
          <Stop offset="0.35" stopColor={s.tone.base} />
          <Stop offset="1" stopColor={s.tone.deep} />
        </LinearGradient>
      ))}
    </Defs>
    {tile ? (
      <>
        <Rect width={64} height={64} rx={18} fill="url(#tile)" />
        <Rect width={64} height={64} rx={18} fill="url(#tileGlow)" />
      </>
    ) : null}
    <Ellipse cx={32} cy={55.5} rx={24} ry={3} fill={clay.lavender.deep} opacity={0.22} />
    {steps.map((s) => (
      <Rect key={`${s.id}-shadow`} x={s.x} y={s.y + 2.5} width={14} height={s.h} rx={5.5} fill={s.tone.deep} opacity={0.45} />
    ))}
    {steps.map((s) => (
      <Rect key={s.id} x={s.x} y={s.y} width={14} height={s.h} rx={5.5} fill={`url(#${s.id})`} />
    ))}
    {steps.map((s) => (
      <Ellipse key={`${s.id}-hl`} cx={s.x + 5.5} cy={s.y + 4.5} rx={3.2} ry={1.7} fill="#FFFFFF" opacity={0.7} />
    ))}
    <Path d="M48 20 l-5 5 M48 20 l5 5 M48 20 v12" stroke="#0F3B2C" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.85} />
  </Svg>
);

export const Logo = ({ size = 40, wordmark = true, light = false }: LogoProps) => (
  <View style={styles.row}>
    <LogoMark size={size} />
    {wordmark ? <Text style={[styles.word, { fontSize: size * 0.6, color: light ? "#FFFFFF" : colors.ink }]}>SkillUp</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  word: { fontFamily: fonts.displayBold, letterSpacing: -0.6 },
});
