import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Icon } from "./Icon";
import { clay, colors, fonts } from "@/theme";

interface StreakRingProps {
  days: number;
  goal?: number;
  size?: number;
}

export const StreakRing = ({ days, goal = 7, size = 132 }: StreakRingProps) => {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = Math.min(1, (days % goal || (days ? goal : 0)) / goal);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.groundDeep} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={clay.peach.deep}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Icon name="flame" size={22} color={clay.peach.deep} strokeWidth={2.4} />
        <Text style={styles.value}>{days}</Text>
        <Text style={styles.label}>{days === 1 ? "day" : "days"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  value: { fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 38, color: colors.ink },
  label: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.muted },
});
