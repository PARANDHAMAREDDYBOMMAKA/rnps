import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Body, Button, Chip, Clay, Display, ErrorBox, Glass, Heading, Loader, Row, Screen, Small, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLayout } from "@/hooks/useLayout";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { clay, colors, scale, space } from "@/theme";

export default function LessonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { wide } = useLayout();
  useLiveProgress();
  const { data, error, loading, reload } = useAsync(() => container.content.lesson(id), [id]);
  const [busy, setBusy] = useState(false);
  const [earned, setEarned] = useState(0);
  const done = container.progress.isLessonDone(id);
  const solvedCount = data ? data.problems.filter((p) => container.progress.isProblemSolved(p.id)).length : 0;

  const complete = async () => {
    setBusy(true);
    try {
      setEarned(await container.progress.completeLesson(id));
    } finally {
      setBusy(false);
    }
  };

  const practice = data?.problems.length ? (
    <View style={styles.practice}>
      <Clay tone="butter" round="tile" onPress={() => router.push({ pathname: "/quiz/[id]", params: { id } })} style={styles.quiz}>
        <View style={styles.quizIcon}>
          <Icon name="zap" size={26} color={clay.butter.text} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Heading>{solvedCount ? "Continue quiz" : "Start quiz"}</Heading>
          <Small style={{ color: clay.butter.text }}>
            {data.problems.length} questions, {solvedCount} solved
          </Small>
        </View>
        <Icon name="arrowRight" size={22} color={clay.butter.text} strokeWidth={2.4} />
      </Clay>
      <Glass inner={styles.list}>
        {data.problems.map((p, i) => {
          const solved = container.progress.isProblemSolved(p.id);
          return (
            <View key={p.id} style={[styles.listRow, i > 0 && styles.listDivider]}>
              <View style={[styles.dot, solved && styles.dotSolved]}>
                {solved ? <Icon name="check" size={14} color={clay.mint.text} strokeWidth={3} /> : <Text style={styles.dotText}>{i + 1}</Text>}
              </View>
              <Text style={[scale.body, { flex: 1 }]} numberOfLines={1}>
                {p.title}
              </Text>
              <Small>{p.difficulty}</Small>
            </View>
          );
        })}
      </Glass>
    </View>
  ) : null;

  return (
    <Screen wide={wide}>
      <TextButton label="Back" onPress={() => router.back()} />
      {loading ? <Loader /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {data ? (
        <View style={[styles.layout, wide && styles.layoutWide]}>
          <View style={[styles.reading, wide && styles.readingWide]}>
            <Display>{data.title}</Display>
            <Row>
              <Chip>{data.durationMin} min read</Chip>
              {done ? <Chip tone="mint">Completed</Chip> : null}
            </Row>
            {data.videoId ? <VideoEmbed videoId={data.videoId} title={data.title} /> : null}
            <Glass strong inner={styles.article}>
              {data.content.split("\n\n").map((para, i) => (
                <Body key={i} style={styles.para}>
                  {para}
                </Body>
              ))}
            </Glass>
            {earned ? (
              <Reveal from={12}>
                <Clay tone="mint" round="tile" style={styles.earned}>
                  <Heading>Nice. +{earned} points</Heading>
                  <Body>Now take the quiz to lock it in.</Body>
                </Clay>
              </Reveal>
            ) : !done ? (
              <Button label="Mark as read, +5 points" onPress={complete} loading={busy} tone="mint" />
            ) : null}
          </View>
          <View style={[styles.sidebar, wide && styles.sidebarWide]}>{practice}</View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: { gap: space.lg },
  layoutWide: { flexDirection: "row", alignItems: "flex-start", gap: space.xl },
  reading: { gap: space.md },
  readingWide: { flex: 1, maxWidth: 680 },
  article: { padding: space.lg, gap: space.md },
  para: { fontSize: 17, lineHeight: 28 },
  sidebar: {},
  sidebarWide: { width: 360 },
  practice: { gap: space.md },
  quiz: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.lg },
  quizIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" },
  list: { gap: 0, paddingVertical: space.xs },
  listRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 10 },
  listDivider: { borderTopWidth: 1, borderTopColor: "rgba(42,37,82,0.08)" },
  dot: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.groundDeep, alignItems: "center", justifyContent: "center" },
  dotSolved: { backgroundColor: clay.mint.base },
  dotText: { fontFamily: "Nunito_700Bold", fontSize: 12, color: colors.muted },
  earned: { alignItems: "flex-start", gap: space.xs, padding: space.lg },
});
