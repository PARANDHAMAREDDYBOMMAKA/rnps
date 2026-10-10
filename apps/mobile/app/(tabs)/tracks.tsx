import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import type { TrackDto } from "@rnp/shared";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Body, Chip, Clay, Display, ErrorBox, Glass, Heading, Loader, ProgressBar, Row, Screen, Small } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLayout } from "@/hooks/useLayout";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { clay, colors, scale, space, type ClayTone } from "@/theme";

const tones: ClayTone[] = ["lavender", "butter", "mint", "peach", "sky"];

const TrackCard = ({ track, tone, done, onPress }: { track: TrackDto; tone: ClayTone; done: number; onPress: () => void }) => {
  const pct = track.lessonCount ? done / track.lessonCount : 0;
  const started = done > 0;
  const finished = track.lessonCount > 0 && done >= track.lessonCount;
  return (
    <Glass onPress={onPress} inner={styles.card}>
      <Row style={styles.head}>
        <Clay tone={tone} round="control" style={styles.iconTile}>
          <Icon name={track.icon} size={28} color={clay[tone].text} strokeWidth={1.8} />
        </Clay>
        <View style={{ flex: 1, gap: 2 }}>
          <Heading>{track.title}</Heading>
          <Small>
            {track.moduleCount} modules, {track.lessonCount} lessons
          </Small>
        </View>
      </Row>
      <Body muted>{track.description}</Body>
      <View style={styles.progress}>
        <ProgressBar value={pct} tone={finished ? "mint" : tone} />
        <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
          <Small>{finished ? "Complete" : started ? `${done} of ${track.lessonCount} done` : "Not started"}</Small>
          <Text style={[scale.small, { color: colors.ink }]}>{Math.round(pct * 100)}%</Text>
        </Row>
      </View>
      <View style={styles.cta}>
        <Text style={[scale.heading, { color: "#FFFFFF" }]}>{finished ? "Review" : started ? "Continue" : "Start track"}</Text>
        <Icon name="arrowRight" size={20} color="#FFFFFF" strokeWidth={2.4} />
      </View>
    </Glass>
  );
};

export default function Tracks() {
  const router = useRouter();
  const { wide } = useLayout();
  const { summary } = useLiveProgress();
  const { data, error, loading, reload } = useAsync(() => container.content.tracks(), []);
  const progress = summary?.trackProgress ?? {};
  const totalLessons = data?.reduce((n, t) => n + t.lessonCount, 0) ?? 0;
  const totalDone = data?.reduce((n, t) => n + (progress[t.id] ?? 0), 0) ?? 0;

  return (
    <Screen wide={wide}>
      <Display>Learn</Display>
      <Body muted>Three tracks, each a stack of short lessons with a quiz at the end of every one.</Body>
      {data?.length ? (
        <Glass inner={styles.overall}>
          <View style={{ flex: 1, gap: 6 }}>
            <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
              <Small>Overall progress</Small>
              <Small>
                {totalDone} of {totalLessons} lessons
              </Small>
            </Row>
            <ProgressBar value={totalLessons ? totalDone / totalLessons : 0} tone="lavender" />
          </View>
          {summary?.rank ? <Chip tone="butter">Rank #{summary.rank}</Chip> : null}
        </Glass>
      ) : null}
      {loading && !data ? <Loader /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      <View style={[styles.grid, wide && styles.gridWide]}>
        {data?.map((t, i) => (
          <Reveal key={t.id} index={i} style={wide ? styles.cell : undefined}>
            <TrackCard track={t} tone={tones[i % tones.length]} done={progress[t.id] ?? 0} onPress={() => router.push({ pathname: "/track/[id]", params: { id: t.id } })} />
          </Reveal>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  overall: { flexDirection: "row", alignItems: "center", gap: space.md },
  grid: { gap: space.md },
  gridWide: { flexDirection: "row", flexWrap: "wrap", alignItems: "stretch" },
  cell: { flexBasis: "48%", flexGrow: 1, minWidth: 320 },
  card: { gap: space.md, padding: space.lg },
  head: { flexWrap: "nowrap", gap: space.md },
  iconTile: { width: 56, height: 56, padding: 0 },
  progress: { gap: 6 },
  cta: { backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.sm },
});
