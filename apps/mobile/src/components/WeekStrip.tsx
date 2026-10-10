import { StyleSheet, Text, View } from "react-native";
import { Icon } from "./Icon";
import { clay, colors, fonts } from "@/theme";

const dayMs = 86_400_000;
const labels = ["S", "M", "T", "W", "T", "F", "S"];

export const WeekStrip = ({ activeDays }: { activeDays: string[] }) => {
  const active = new Set(activeDays);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * dayMs);
    const key = d.toISOString().slice(0, 10);
    return { key, label: labels[d.getUTCDay()], done: active.has(key), isToday: i === 6 };
  });
  return (
    <View style={styles.row}>
      {days.map((d) => (
        <View key={d.key} style={styles.day}>
          <View style={[styles.dot, d.done && styles.done, d.isToday && !d.done && styles.today]}>
            {d.done ? <Icon name="check" size={16} color={clay.mint.text} strokeWidth={3} /> : null}
          </View>
          <Text style={[styles.label, d.isToday && styles.labelToday]}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", gap: 4 },
  day: { alignItems: "center", gap: 6, flex: 1 },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.groundDeep, alignItems: "center", justifyContent: "center" },
  done: { backgroundColor: clay.mint.base },
  today: { borderWidth: 2, borderColor: clay.lavender.deep },
  label: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.muted },
  labelToday: { color: colors.ink },
});
