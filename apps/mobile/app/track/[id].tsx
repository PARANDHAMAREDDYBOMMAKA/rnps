import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LayoutAnimation, Pressable, StyleSheet, Text, View } from "react-native";
import type { ModuleDto } from "@rnp/shared";
import { Icon } from "@/components/Icon";
import { Body, Chip, Clay, Display, ErrorBox, Glass, Heading, Loader, ProgressBar, Row, Screen, Small, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLayout } from "@/hooks/useLayout";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { clay, colors, scale, space } from "@/theme";

interface ModuleSectionProps {
  module: ModuleDto;
  index: number;
  open: boolean;
  onToggle: () => void;
  onLesson: (id: string) => void;
}

const ModuleSection = ({ module, index, open, onToggle, onLesson }: ModuleSectionProps) => {
  const done = module.lessons.filter((l) => container.progress.isLessonDone(l.id)).length;
  const complete = done === module.lessons.length;
  return (
    <Glass inner={styles.module}>
      <Pressable onPress={onToggle} style={styles.moduleHead}>
        <View style={[styles.moduleNum, complete && styles.moduleNumDone]}>
          {complete ? <Icon name="check" size={16} color={clay.mint.text} strokeWidth={3} /> : <Text style={styles.moduleNumText}>{index + 1}</Text>}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Heading>{module.title}</Heading>
          <Small>
            {done} of {module.lessons.length} lessons done
          </Small>
        </View>
        <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <Icon name="chevronDown" size={20} color={colors.muted} />
        </View>
      </Pressable>
      {open ? (
        <View style={styles.lessons}>
          <Small>{module.description}</Small>
          {module.lessons.map((l, i) => {
            const finished = container.progress.isLessonDone(l.id);
            return (
              <Pressable key={l.id} onPress={() => onLesson(l.id)} style={({ pressed, hovered }) => [styles.lesson, (pressed || hovered) && styles.lessonActive]}>
                <View style={[styles.lessonDot, finished && styles.lessonDotDone]}>
                  {finished ? <Icon name="check" size={13} color={clay.mint.text} strokeWidth={3} /> : <Text style={styles.lessonDotText}>{i + 1}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={scale.body}>{l.title}</Text>
                  <Small>
                    {l.durationMin} min, {l.problemCount} {l.problemCount === 1 ? "question" : "questions"}
                  </Small>
                </View>
                <Icon name="arrowRight" size={18} color={colors.faint} />
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </Glass>
  );
};

export default function TrackDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { wide } = useLayout();
  useLiveProgress();
  const { data, error, loading, reload } = useAsync(() => container.content.track(id), [id]);
  const [open, setOpen] = useState<string | null>(null);
  const lessons = data ? data.modules.flatMap((m) => m.lessons) : [];
  const done = lessons.filter((l) => container.progress.isLessonDone(l.id)).length;
  const next = lessons.find((l) => !container.progress.isLessonDone(l.id));

  useEffect(() => {
    if (!data || open) return;
    const firstOpen = data.modules.find((m) => m.lessons.some((l) => !container.progress.isLessonDone(l.id))) ?? data.modules[0];
    if (firstOpen) setOpen(firstOpen.id);
  }, [data]);

  const toggle = (moduleId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((cur) => (cur === moduleId ? null : moduleId));
  };

  return (
    <Screen wide={wide}>
      <TextButton label="Back" onPress={() => router.back()} />
      {loading ? <Loader /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {data ? (
        <View style={[styles.layout, wide && styles.layoutWide]}>
          <View style={[styles.side, wide && styles.sideWide]}>
            <Clay tone="lavender" round="tile" style={styles.cover}>
              <View style={styles.coverIcon}>
                <Icon name={data.icon} size={34} color={clay.lavender.text} strokeWidth={1.8} />
              </View>
              <Display>{data.title}</Display>
              <Body>{data.description}</Body>
              <Row>
                <Chip tone="white">{data.moduleCount} modules</Chip>
                <Chip tone="white">{data.lessonCount} lessons</Chip>
              </Row>
            </Clay>
            <Glass>
              <ProgressBar value={data.lessonCount ? done / data.lessonCount : 0} />
              <Small>
                {done} of {data.lessonCount} lessons done
              </Small>
              {next ? (
                <Clay tone="ink" onPress={() => router.push({ pathname: "/lesson/[id]", params: { id: next.id } })} style={styles.next}>
                  <Text style={styles.nextLabel} numberOfLines={1}>
                    {done ? "Continue: " : "Start with: "}
                    {next.title}
                  </Text>
                  <Icon name="arrowRight" size={18} color="#FFFFFF" strokeWidth={2.4} />
                </Clay>
              ) : (
                <Chip tone="mint">Track complete</Chip>
              )}
            </Glass>
          </View>
          <View style={[styles.main, wide && styles.mainWide]}>
            {data.modules.map((m, mi) => (
              <ModuleSection
                key={m.id}
                module={m}
                index={mi}
                open={open === m.id}
                onToggle={() => toggle(m.id)}
                onLesson={(lessonId) => router.push({ pathname: "/lesson/[id]", params: { id: lessonId } })}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: { gap: space.md },
  layoutWide: { flexDirection: "row", alignItems: "flex-start", gap: space.xl },
  side: { gap: space.md },
  sideWide: { width: 360 },
  main: { gap: space.sm },
  mainWide: { flex: 1 },
  cover: { alignItems: "flex-start", gap: space.sm, padding: space.lg },
  coverIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" },
  next: { alignSelf: "stretch", marginTop: space.xs, flexDirection: "row", gap: space.sm, justifyContent: "space-between" },
  nextLabel: { color: "#FFFFFF", fontFamily: "Nunito_700Bold", fontSize: 15, flex: 1 },
  module: { gap: 0, padding: space.sm },
  moduleHead: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.sm },
  moduleNum: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.groundDeep, alignItems: "center", justifyContent: "center" },
  moduleNumDone: { backgroundColor: clay.mint.base },
  moduleNumText: { fontFamily: "Fredoka_700Bold", fontSize: 16, color: colors.ink },
  lessons: { gap: 4, paddingHorizontal: space.sm, paddingBottom: space.sm },
  lesson: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 10, paddingHorizontal: space.sm, borderRadius: 14 },
  lessonActive: { backgroundColor: "rgba(255,255,255,0.6)" },
  lessonDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.groundDeep, alignItems: "center", justifyContent: "center" },
  lessonDotDone: { backgroundColor: clay.mint.base },
  lessonDotText: { fontFamily: "Nunito_700Bold", fontSize: 12, color: colors.muted },
});
