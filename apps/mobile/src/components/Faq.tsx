import { useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "./Icon";
import { Body, Glass, Heading } from "./ui";
import { colors, scale, space } from "@/theme";

const items = [
  { q: "Is it free?", a: "Yes. Every track, lesson, and question is free while we build out the catalog." },
  { q: "How long is a session?", a: "A lesson is five to twelve minutes. Add the questions and you're done in fifteen." },
  { q: "Does progress sync?", a: "Your account carries points, streaks, and completed lessons across phone and web." },
  { q: "What kind of questions?", a: "Multiple choice to check understanding, short answer to make you recall it yourself. Coding sandboxes are next." },
];

export const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(open === i ? null : i);
  };
  return (
    <Glass inner={styles.wrap}>
      <Heading>Questions people ask first</Heading>
      {items.map((it, i) => {
        const expanded = open === i;
        return (
          <Pressable key={it.q} onPress={() => toggle(i)} style={[styles.item, i > 0 && styles.divider]}>
            <View style={styles.head}>
              <Text style={[scale.body, styles.q]}>{it.q}</Text>
              <View style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
                <Icon name="chevronDown" size={20} color={colors.muted} />
              </View>
            </View>
            {expanded ? <Body muted>{it.a}</Body> : null}
          </Pressable>
        );
      })}
    </Glass>
  );
};

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  item: { paddingVertical: space.md, gap: space.sm },
  divider: { borderTopWidth: 1, borderTopColor: "rgba(42,37,82,0.08)" },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space.md },
  q: { fontFamily: "Nunito_700Bold", flex: 1 },
});
