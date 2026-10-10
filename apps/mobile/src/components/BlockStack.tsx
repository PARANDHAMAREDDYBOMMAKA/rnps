import { StyleSheet, View } from "react-native";
import type { TrackDto } from "@rnp/shared";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Clay, Heading, Small } from "./ui";
import { clay, space, type ClayTone } from "@/theme";

export interface Block {
  id: string;
  icon: string;
  title: string;
  caption: string;
}

const tones: ClayTone[] = ["lavender", "butter", "mint", "peach", "sky"];
const tilts = [-5, 4, -3, 5, -4];

export const fallbackBlocks: Block[] = [
  { id: "dsa", icon: "brain", title: "Data Structures & Algorithms", caption: "50 lessons" },
  { id: "sd", icon: "layers", title: "System Design", caption: "50 lessons" },
  { id: "iv", icon: "target", title: "Interview Readiness", caption: "50 lessons" },
];

export const toBlocks = (tracks: TrackDto[]): Block[] =>
  tracks.map((t) => ({ id: t.id, icon: t.icon, title: t.title, caption: `${t.lessonCount} ${t.lessonCount === 1 ? "lesson" : "lessons"}` }));

interface BlockStackProps {
  blocks: Block[];
  onPress?: (id: string) => void;
  compact?: boolean;
  animate?: boolean;
}

export const BlockStack = ({ blocks, onPress, compact = false, animate = true }: BlockStackProps) => (
  <View style={[styles.stack, compact && styles.compact]}>
    {blocks.map((b, i) => {
      const tone = tones[i % tones.length];
      const block = (
        <Clay
          tone={tone}
          round="tile"
          onPress={onPress ? () => onPress(b.id) : undefined}
          style={[styles.block, compact && styles.blockCompact, { transform: [{ rotate: `${tilts[i % tilts.length]}deg` }] }]}
        >
          <View style={[styles.iconWell, compact && styles.iconWellCompact, { backgroundColor: "rgba(255,255,255,0.45)" }]}>
            <Icon name={b.icon} size={compact ? 26 : 32} color={clay[tone].text} strokeWidth={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Heading>{b.title}</Heading>
            <Small>{b.caption}</Small>
          </View>
        </Clay>
      );
      const wrapStyle = { marginTop: i === 0 ? 0 : compact ? -8 : -14, zIndex: blocks.length - i };
      return animate ? (
        <Reveal key={b.id} index={i} style={wrapStyle}>
          {block}
        </Reveal>
      ) : (
        <View key={b.id} style={wrapStyle}>
          {block}
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  stack: { paddingVertical: space.lg, paddingHorizontal: space.sm },
  compact: { paddingVertical: space.sm },
  block: { flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: space.lg, paddingHorizontal: space.lg, alignSelf: "stretch" },
  blockCompact: { paddingVertical: space.md },
  iconWell: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  iconWellCompact: { width: 48, height: 48, borderRadius: 16 },
});
