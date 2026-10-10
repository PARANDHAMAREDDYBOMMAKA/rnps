import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Clay } from "./ui";
import { clay, scale, space, type ClayTone } from "@/theme";

const topics = [
  "Big-O",
  "Two pointers",
  "Hash maps",
  "Linked lists",
  "Binary search",
  "Caching",
  "Load balancing",
  "SQL joins",
  "STAR answers",
  "Resume bullets",
  "Recursion",
  "Dynamic programming",
];

const tones: ClayTone[] = ["white", "sky", "white", "butter", "white", "mint", "white", "peach", "white", "lavender"];

export const TopicStrip = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
    {topics.map((t, i) => {
      const tone = tones[i % tones.length];
      return (
        <View key={t} style={{ transform: [{ rotate: `${i % 2 ? 2 : -2}deg` }] }}>
          <Clay tone={tone} round="chip" style={styles.chip}>
            <Text style={[scale.body, { color: clay[tone].text }]}>{t}</Text>
          </Clay>
        </View>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  strip: { gap: space.sm, paddingVertical: space.md, paddingHorizontal: space.xs },
  chip: { paddingHorizontal: 18, paddingVertical: 10 },
});
