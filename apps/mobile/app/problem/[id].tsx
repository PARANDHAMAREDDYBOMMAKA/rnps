import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import type { SubmissionResultDto } from "@rnp/shared";
import { Reveal } from "@/components/Reveal";
import { Body, Button, Chip, Clay, Display, ErrorBox, Glass, Heading, Input, Loader, Row, Screen, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { clay, difficultyTone, scale, space } from "@/theme";
const letters = ["A", "B", "C", "D", "E", "F"];

export default function ProblemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  useLiveProgress();
  const { data, error, loading, reload } = useAsync(() => container.content.problem(id), [id]);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<SubmissionResultDto | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const solved = container.progress.isProblemSolved(id);

  const submit = async () => {
    if (!answer.trim()) return;
    setBusy(true);
    setSubmitError(null);
    try {
      setResult(await container.progress.submit(id, answer));
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const choose = (opt: string) => {
    setAnswer(opt);
    setResult(null);
  };

  return (
    <Screen>
      <TextButton label="Back" onPress={() => router.back()} />
      {loading ? <Loader /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {data ? (
        <View style={styles.column}>
          <Display>{data.title}</Display>
          <Row>
            <Chip tone={difficultyTone(data.difficulty)}>{data.difficulty}</Chip>
            {solved ? <Chip tone="mint">Solved</Chip> : null}
          </Row>
          <Glass strong inner={styles.prompt}>
            <Body style={styles.promptText}>{data.prompt}</Body>
          </Glass>
          {data.options ? (
            <View style={styles.options}>
              {data.options.map((opt, i) => {
                const picked = answer === opt;
                const tone = result ? (result.correct && picked ? "mint" : picked ? "peach" : "white") : picked ? "lavender" : "white";
                return (
                  <Clay key={opt} tone={tone} onPress={() => choose(opt)} style={styles.option}>
                    <View style={[styles.letter, { backgroundColor: clay[tone].deep }]}>
                      <Text style={[scale.small, { color: "#FFFFFF" }]}>{letters[i]}</Text>
                    </View>
                    <Text style={[scale.body, { color: clay[tone].text, flex: 1 }]}>{opt}</Text>
                  </Clay>
                );
              })}
            </View>
          ) : (
            <Input label="Your answer" placeholder="Type your answer" value={answer} onChangeText={setAnswer} multiline numberOfLines={4} style={styles.area} />
          )}
          {submitError ? <ErrorBox message={submitError} /> : null}
          {!result ? <Button label="Check answer" onPress={submit} loading={busy} disabled={!answer.trim()} /> : null}
          {result ? (
            <Reveal from={12}>
              <Clay tone={result.correct ? "mint" : "peach"} round="tile" style={styles.result}>
                <Heading>{result.correct ? "Correct" : "Not quite"}</Heading>
                {result.correct && result.pointsAwarded ? <Chip tone="white">+{result.pointsAwarded} points</Chip> : null}
                <Body>{result.correct ? result.explanation : "Pick a different answer and check again."}</Body>
                {result.correct ? <Button label="Back to lesson" tone="white" onPress={() => router.back()} style={{ alignSelf: "flex-start" }} /> : null}
              </Clay>
            </Reveal>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: { gap: space.md, maxWidth: 640, width: "100%" },
  prompt: { padding: space.lg },
  promptText: { fontSize: 18, lineHeight: 28 },
  options: { gap: space.sm },
  option: { flexDirection: "row", alignItems: "center", gap: space.md, justifyContent: "flex-start", paddingVertical: 14 },
  letter: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  area: { minHeight: 110, textAlignVertical: "top" },
  result: { alignItems: "flex-start", gap: space.sm, padding: space.lg },
});
