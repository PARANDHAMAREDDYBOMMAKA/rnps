import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import type { ProblemDto, SubmissionResultDto } from "@rnp/shared";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Body, Button, Chip, Clay, Display, ErrorBox, Glass, Heading, Loader, ProgressBar, Row, Screen, Small, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { clay, colors, difficultyTone, scale, space } from "@/theme";

const letters = ["A", "B", "C", "D", "E", "F"];

interface Answered {
  picked: string;
  result: SubmissionResultDto;
}

class QuizSession {
  readonly answers = new Map<string, Answered>();

  constructor(readonly problems: ProblemDto[]) {}

  get correct(): number {
    return [...this.answers.values()].filter((a) => a.result.correct).length;
  }

  get points(): number {
    return [...this.answers.values()].reduce((n, a) => n + a.result.pointsAwarded, 0);
  }
}

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  useLiveProgress();
  const { data, error, loading, reload } = useAsync(() => container.content.lessonProblems(id), [id]);
  const session = useMemo(() => (data ? new QuizSession(data) : null), [data]);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, bump] = useState(0);

  const problem = session?.problems[index] ?? null;
  const answered = problem ? session?.answers.get(problem.id) ?? null : null;
  const finished = session ? index >= session.problems.length : false;

  const choose = async (opt: string) => {
    if (!problem || !session || answered || busy) return;
    setBusy(true);
    setSubmitError(null);
    try {
      const result = await container.progress.submit(problem.id, opt);
      session.answers.set(problem.id, { picked: opt, result });
      bump((n) => n + 1);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const tone = (opt: string) => {
    if (!answered) return "white";
    if (answered.result.correct && opt === answered.picked) return "mint";
    if (opt === answered.picked) return "peach";
    return "white";
  };

  return (
    <Screen>
      <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        <TextButton label="Back to lesson" onPress={() => router.back()} />
        {session && !finished ? (
          <Small>
            {index + 1} of {session.problems.length}
          </Small>
        ) : null}
      </Row>
      {loading ? <Loader /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {session && !session.problems.length ? (
        <Glass>
          <Body>This lesson has no questions yet.</Body>
        </Glass>
      ) : null}
      {session && problem && !finished ? (
        <View style={styles.column}>
          <ProgressBar value={index / session.problems.length} tone="lavender" />
          <Reveal key={problem.id} from={16}>
            <View style={{ gap: space.md }}>
              <Row>
                <Chip tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Chip>
                {container.progress.isProblemSolved(problem.id) && !answered ? <Chip tone="mint">Solved before</Chip> : null}
              </Row>
              <Heading style={styles.title}>{problem.title}</Heading>
              <Glass strong inner={styles.prompt}>
                <Body style={styles.promptText}>{problem.prompt}</Body>
              </Glass>
              <View style={styles.options}>
                {(problem.options ?? []).map((opt, i) => {
                  const t = tone(opt);
                  return (
                    <Clay key={opt} tone={t} onPress={answered ? undefined : () => void choose(opt)} disabled={busy} style={styles.option}>
                      <View style={[styles.letter, { backgroundColor: clay[t].deep }]}>
                        <Text style={[scale.small, { color: "#FFFFFF" }]}>{letters[i]}</Text>
                      </View>
                      <Text style={[scale.body, { color: clay[t].text, flex: 1 }]}>{opt}</Text>
                      {answered && opt === answered.picked ? (
                        <Icon name={answered.result.correct ? "check" : "arrowRight"} size={20} color={clay[t].text} strokeWidth={2.6} />
                      ) : null}
                    </Clay>
                  );
                })}
              </View>
              {submitError ? <ErrorBox message={submitError} /> : null}
              {answered ? (
                <Reveal from={10}>
                  <Clay tone={answered.result.correct ? "mint" : "peach"} round="tile" style={styles.feedback}>
                    <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
                      <Heading>{answered.result.correct ? "Correct" : "Not quite"}</Heading>
                      {answered.result.pointsAwarded ? <Chip tone="white">+{answered.result.pointsAwarded} pts</Chip> : null}
                    </Row>
                    {answered.result.correct ? <Body>{answered.result.explanation}</Body> : <Body>You can retry this one from the lesson page later.</Body>}
                    <Button
                      label={index + 1 < session.problems.length ? "Next question" : "See results"}
                      tone="ink"
                      onPress={() => setIndex((i) => i + 1)}
                      style={{ alignSelf: "flex-start" }}
                    />
                  </Clay>
                </Reveal>
              ) : null}
            </View>
          </Reveal>
        </View>
      ) : null}
      {session && finished ? (
        <Reveal from={16}>
          <View style={styles.column}>
            <Clay tone="lavender" round="tile" style={styles.results}>
              <View style={styles.scoreWell}>
                <Text style={styles.score}>
                  {session.correct}/{session.problems.length}
                </Text>
              </View>
              <Display>{session.correct === session.problems.length ? "Perfect round" : session.correct >= session.problems.length / 2 ? "Solid work" : "Keep at it"}</Display>
              <Body>
                {session.points ? `You earned ${session.points} points this round.` : "No new points this round. Correct first tries earn points."}
              </Body>
              <Row>
                <Button label="Back to lesson" tone="ink" onPress={() => router.back()} />
                <Button label="Retry quiz" tone="white" onPress={() => { session.answers.clear(); setIndex(0); }} />
              </Row>
            </Clay>
            <Heading>Review</Heading>
            {session.problems.map((p, i) => {
              const a = session.answers.get(p.id);
              return (
                <Glass key={p.id} onPress={() => router.push({ pathname: "/problem/[id]", params: { id: p.id } })}>
                  <Row style={{ flexWrap: "nowrap" }}>
                    <View style={[styles.reviewDot, { backgroundColor: a?.result.correct ? clay.mint.base : clay.peach.base }]}>
                      <Icon name={a?.result.correct ? "check" : "arrowRight"} size={16} color={colors.ink} strokeWidth={2.6} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Body>
                        {i + 1}. {p.title}
                      </Body>
                      {a && !a.result.correct ? <Small>You picked: {a.picked}</Small> : null}
                    </View>
                  </Row>
                </Glass>
              );
            })}
          </View>
        </Reveal>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: { gap: space.md, maxWidth: 640, width: "100%" },
  title: { fontSize: 24, lineHeight: 28 },
  prompt: { padding: space.lg },
  promptText: { fontSize: 18, lineHeight: 28 },
  options: { gap: space.sm },
  option: { flexDirection: "row", alignItems: "center", gap: space.md, justifyContent: "flex-start", paddingVertical: 14 },
  letter: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  feedback: { alignItems: "stretch", gap: space.sm, padding: space.lg },
  results: { alignItems: "flex-start", gap: space.md, padding: space.lg },
  scoreWell: { backgroundColor: "rgba(255,255,255,0.55)", borderRadius: 24, paddingHorizontal: 20, paddingVertical: 10 },
  score: { fontFamily: "Fredoka_700Bold", fontSize: 40, lineHeight: 44, color: colors.ink },
  reviewDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
