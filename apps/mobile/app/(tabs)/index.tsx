import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BlockStack, toBlocks } from "@/components/BlockStack";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { StreakRing } from "@/components/StreakRing";
import { WeekStrip } from "@/components/WeekStrip";
import { Body, Chip, Clay, Display, Glass, Heading, Row, Screen, Small } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLayout } from "@/hooks/useLayout";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { useStore } from "@/hooks/useStore";
import { clay, colors, scale, space, type ClayTone } from "@/theme";

const Stat = ({ icon, label, value, tone }: { icon: IconName; label: string; value: string; tone: ClayTone }) => (
  <Glass style={styles.stat} inner={styles.statInner}>
    <View style={[styles.statIcon, { backgroundColor: clay[tone].base }]}>
      <Icon name={icon} size={18} color={clay[tone].text} strokeWidth={2.4} />
    </View>
    <Text style={scale.stat}>{value}</Text>
    <Small>{label}</Small>
  </Glass>
);

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export default function Home() {
  const router = useRouter();
  const { wide } = useLayout();
  const { user } = useStore(container.auth);
  useLiveProgress();
  const s = container.progress.summary;
  const { data } = useAsync(() => container.content.tracks(), []);
  const first = user?.name.split(" ")[0] ?? "there";
  const next = s.nextLesson;

  return (
    <Screen wide={wide}>
      <Row style={styles.top}>
        <Logo size={32} />
        {s.rank ? <Chip tone="butter">Rank #{s.rank}</Chip> : null}
      </Row>
      <Display>
        {greeting()}, {first}
      </Display>
      <Body muted>{s.streakDays ? "Your streak is alive. One rep today keeps it that way." : "No streak yet. Finish one lesson today to start one."}</Body>

      <View style={[styles.grid, wide && styles.gridWide]}>
        <View style={[styles.col, wide && { flex: 1.2 }]}>
          {next ? (
            <Reveal index={0}>
              <Clay tone="lavender" round="tile" onPress={() => router.push({ pathname: "/lesson/[id]", params: { id: next.lessonId } })} style={styles.next}>
                <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
                  <Small style={{ color: colors.ink }}>{s.completedLessons ? "Continue" : "Start here"}</Small>
                  <Chip tone="white">{next.durationMin} min</Chip>
                </Row>
                <Heading style={styles.nextTitle}>{next.lessonTitle}</Heading>
                <Row style={{ flexWrap: "nowrap" }}>
                  <Icon name={next.trackIcon} size={18} color={colors.ink} />
                  <Small style={{ color: colors.ink, flex: 1 }}>
                    {next.trackTitle}, {next.moduleTitle}
                  </Small>
                </Row>
                <View style={styles.nextCta}>
                  <Text style={[scale.heading, { color: "#FFFFFF" }]}>Open lesson</Text>
                  <Icon name="arrowRight" size={20} color="#FFFFFF" strokeWidth={2.4} />
                </View>
              </Clay>
            </Reveal>
          ) : (
            <Reveal index={0}>
              <Clay tone="mint" round="tile" style={styles.next}>
                <Heading>Every lesson done</Heading>
                <Body>Revisit practice questions to keep the streak going. New lessons land weekly.</Body>
              </Clay>
            </Reveal>
          )}
          <Reveal index={1}>
            <Row style={styles.stats}>
              <Stat icon="zap" label="points" value={`${s.totalPoints}`} tone="butter" />
              <Stat icon="book" label="lessons" value={`${s.completedLessons}`} tone="sky" />
              <Stat icon="check" label="solved" value={`${s.solvedProblems}`} tone="mint" />
            </Row>
          </Reveal>
        </View>

        <View style={[styles.col, wide && { flex: 1 }]}>
          <Reveal index={2}>
            <Glass strong inner={styles.streak}>
              <StreakRing days={s.streakDays} />
              <View style={{ flex: 1, gap: space.sm }}>
                <Heading>This week</Heading>
                <WeekStrip activeDays={s.recentDays} />
                <Small>{s.streakDays >= 7 ? "A full week. Keep stacking." : `${7 - (s.streakDays % 7)} more ${7 - (s.streakDays % 7) === 1 ? "day" : "days"} to a full week.`}</Small>
              </View>
            </Glass>
          </Reveal>
        </View>
      </View>

      <Heading>Tracks</Heading>
      {data ? <BlockStack compact animate={false} blocks={toBlocks(data)} onPress={(id) => router.push({ pathname: "/track/[id]", params: { id } })} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { justifyContent: "space-between", flexWrap: "nowrap" },
  grid: { gap: space.md },
  gridWide: { flexDirection: "row", alignItems: "flex-start", gap: space.lg },
  col: { gap: space.md },
  next: { alignItems: "stretch", gap: space.sm, padding: space.lg },
  nextTitle: { fontSize: 26, lineHeight: 30 },
  nextCta: { marginTop: space.xs, backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.sm },
  stats: { gap: space.sm, flexWrap: "nowrap" },
  stat: { flex: 1, minWidth: 0 },
  statInner: { gap: 6 },
  statIcon: { width: 32, height: 32, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  streak: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.lg },
});
