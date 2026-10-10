import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BlockStack, fallbackBlocks, toBlocks } from "@/components/BlockStack";
import { Faq } from "@/components/Faq";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { SampleQuestion } from "@/components/SampleQuestion";
import { TopicStrip } from "@/components/TopicStrip";
import { Body, Button, Clay, Gap, Glass, Heading, Hero, Row, Screen, Small, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLayout } from "@/hooks/useLayout";
import { clay, colors, scale, space } from "@/theme";

const steps = [
  { tone: "lavender", title: "Read", text: "One idea per lesson, written to be finished in under ten minutes." },
  { tone: "butter", title: "Answer", text: "Every lesson ends with the questions interviewers actually ask." },
  { tone: "mint", title: "Earn", text: "Points for first-try answers. Streaks for showing up tomorrow." },
] as const;

const Figure = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.figure}>
    <Text style={scale.stat}>{value}</Text>
    <Small>{label}</Small>
  </View>
);

export default function Landing() {
  const router = useRouter();
  const { wide, compact } = useLayout();
  const { data } = useAsync(() => container.content.tracks(), []);
  const blocks = data?.length ? toBlocks(data) : fallbackBlocks;
  const lessonTotal = data?.reduce((n, t) => n + t.lessonCount, 0) ?? 5;
  const goRegister = () => router.push("/(auth)/register");
  const goLogin = () => router.push("/(auth)/login");

  return (
    <Screen wide>
      <Row style={styles.bar}>
        <Logo size={compact ? 36 : 44} />
        <Row style={{ flexWrap: "nowrap" }}>
          <TextButton label="Sign in" onPress={goLogin} />
          {!compact ? <Button label="Get started" onPress={goRegister} style={styles.barCta} /> : null}
        </Row>
      </Row>

      <View style={[styles.hero, wide && styles.heroRow]}>
        <View style={[styles.heroCopy, wide && { flex: 1.1 }]}>
          <Gap size={wide ? "xl" : "lg"} />
          <Hero style={wide ? styles.heroTextWide : undefined}>Build interview skills one block at a time.</Hero>
          <Body muted style={styles.lede}>
            Short lessons and real questions for engineering students who want to walk into interviews ready. Ten minutes a day is enough.
          </Body>
          <Gap size="sm" />
          <Row>
            <Button label="Create free account" onPress={goRegister} style={styles.cta} />
            <Button label="I have an account" tone="white" onPress={goLogin} style={styles.cta} />
          </Row>
          <Small>No card, no spam. Progress syncs between phone and web.</Small>
        </View>
        <View style={[styles.heroBlocks, wide && { flex: 1 }]}>
          <BlockStack blocks={blocks} />
          <Reveal index={blocks.length} style={styles.floatBadge}>
            <Clay tone="butter" round="chip" style={styles.badge}>
              <Text style={[scale.heading, { color: clay.butter.text }]}>+10 pts</Text>
            </Clay>
          </Reveal>
        </View>
      </View>

      <Glass inner={[styles.figures, wide && styles.figuresRow]}>
        <Figure value={`${blocks.length}`} label="tracks to start with" />
        <Figure value={`${lessonTotal}`} label="lessons, growing weekly" />
        <Figure value="10 min" label="per lesson, questions included" />
      </Glass>

      <Gap size="md" />
      <Heading>Topics you'll actually be asked about</Heading>
      <TopicStrip />

      <Gap size="md" />
      <Heading>How a session goes</Heading>
      <View style={[styles.steps, wide && styles.stepsRow]}>
        {steps.map((s, i) => (
          <Glass key={s.title} style={wide ? { flex: 1 } : undefined}>
            <Row>
              <Clay tone={s.tone} round="chip" style={styles.stepNum}>
                <Text style={[scale.heading, { color: clay[s.tone].text }]}>{i + 1}</Text>
              </Clay>
              <Heading>{s.title}</Heading>
            </Row>
            <Body muted>{s.text}</Body>
          </Glass>
        ))}
      </View>

      <Gap size="lg" />
      <View style={[styles.split, wide && styles.splitRow]}>
        <View style={wide ? { flex: 1 } : undefined}>
          <SampleQuestion />
        </View>
        <View style={wide ? { flex: 1 } : undefined}>
          <Faq />
        </View>
      </View>

      <Gap size="lg" />
      <Clay tone="lavender" round="tile" style={[styles.closing, wide && styles.closingRow]}>
        <View style={[styles.closingCopy, wide && { flex: 1 }]}>
          <Heading>Ready when you are</Heading>
          <Body>Pick a track, finish one lesson, and you're on the leaderboard tonight.</Body>
        </View>
        <Button label="Create free account" onPress={goRegister} style={!wide ? styles.closingCta : undefined} />
      </Clay>

      <Gap size="md" />
      <Row style={styles.footer}>
        <Logo size={28} />
        <Small>Made for engineering students. Android and web.</Small>
        <TextButton label="Sign in" onPress={goLogin} />
      </Row>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { justifyContent: "space-between", flexWrap: "nowrap" },
  barCta: { minHeight: 44, paddingVertical: 8 },
  hero: { gap: space.md },
  heroRow: { flexDirection: "row", alignItems: "center", gap: space.xl },
  heroCopy: { gap: space.md },
  heroTextWide: { fontSize: 58, lineHeight: 62 },
  lede: { fontSize: 18, lineHeight: 28, maxWidth: 560 },
  heroBlocks: { width: "100%" },
  floatBadge: { position: "absolute", top: 4, right: 8, transform: [{ rotate: "8deg" }] },
  badge: { paddingHorizontal: 16, paddingVertical: 8 },
  cta: { flexGrow: 1, minWidth: 200 },
  figures: { gap: space.md },
  figuresRow: { flexDirection: "row", justifyContent: "space-around" },
  figure: { gap: 2, alignItems: "flex-start" },
  steps: { gap: space.md },
  stepsRow: { flexDirection: "row" },
  stepNum: { width: 40, height: 40, padding: 0 },
  split: { gap: space.md },
  splitRow: { flexDirection: "row", alignItems: "flex-start", gap: space.lg },
  closing: { alignItems: "stretch", gap: space.md, padding: space.lg },
  closingRow: { flexDirection: "row", alignItems: "center", gap: space.lg },
  closingCopy: { gap: space.sm },
  closingCta: { alignSelf: "stretch" },
  footer: { justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.groundDeep, paddingTop: space.md },
});
