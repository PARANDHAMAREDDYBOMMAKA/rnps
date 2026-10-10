import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Body, Chip, Clay, Glass, Heading, Row, Small } from "./ui";
import { clay, scale, space } from "@/theme";

const sample = {
  prompt: "Two nested loops each run over n elements. What is the time complexity?",
  options: ["O(n)", "O(n log n)", "O(n²)", "O(2n)"],
  answer: "O(n²)",
  explanation: "Each of the n outer iterations runs n inner iterations, so the work grows with n × n.",
};

export const SampleQuestion = () => {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === sample.answer;

  return (
    <Glass strong>
      <Row style={{ justifyContent: "space-between" }}>
        <Heading>Try one now</Heading>
        <Chip tone="butter">easy, 10 pts</Chip>
      </Row>
      <Body>{sample.prompt}</Body>
      <View style={styles.options}>
        {sample.options.map((opt) => {
          const tone = picked === null ? "white" : opt === sample.answer ? "mint" : opt === picked ? "peach" : "white";
          return (
            <Clay key={opt} tone={tone} onPress={() => setPicked(opt)} style={styles.option}>
              <Text style={[scale.body, { color: clay[tone].text }]}>{opt}</Text>
            </Clay>
          );
        })}
      </View>
      {picked ? (
        <View style={styles.feedback}>
          <Heading>{correct ? "Correct" : "Not quite"}</Heading>
          <Small>{sample.explanation}</Small>
        </View>
      ) : null}
    </Glass>
  );
};

const styles = StyleSheet.create({
  options: { gap: space.sm },
  option: { alignItems: "flex-start", paddingVertical: 14 },
  feedback: { gap: space.xs, paddingTop: space.xs },
});
