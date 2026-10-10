import { StyleSheet, Text, View } from "react-native";
import { Body, Button, Clay, Display, Glass, Heading, Row, Screen, Small } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { useStore } from "@/hooks/useStore";
import { clay, scale, space } from "@/theme";

const Line = ({ label, value }: { label: string; value: string | number }) => (
  <Row style={styles.line}>
    <Body muted>{label}</Body>
    <Text style={scale.heading}>{value}</Text>
  </Row>
);

export default function Profile() {
  const { user } = useStore(container.auth);
  useLiveProgress();
  const s = container.progress.summary;
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Screen>
      <Display>You</Display>
      <Glass strong>
        <Row style={{ flexWrap: "nowrap", gap: space.md }}>
          <Clay tone="sky" round="tile" style={styles.avatar}>
            <Text style={[scale.heading, { color: clay.sky.text }]}>{initials}</Text>
          </Clay>
          <View style={{ flex: 1 }}>
            <Heading>{user?.name}</Heading>
            <Small>{user?.email}</Small>
            <Small>Joined {user ? new Date(user.createdAt).toLocaleDateString() : ""}</Small>
          </View>
        </Row>
      </Glass>
      <Glass>
        <Line label="Points" value={s.totalPoints} />
        <Line label="Current streak" value={`${s.streakDays} days`} />
        <Line label="Lessons completed" value={s.completedLessons} />
        <Line label="Problems solved" value={s.solvedProblems} />
      </Glass>
      <Button label="Sign out" tone="white" onPress={() => void container.auth.logout()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 64, height: 64, padding: 0 },
  line: { justifyContent: "space-between", flexWrap: "nowrap", paddingVertical: 4 },
});
