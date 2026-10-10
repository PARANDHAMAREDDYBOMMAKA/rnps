import { StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/Icon";
import { Body, Chip, Display, ErrorBox, Glass, Loader, Row, Screen } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAsync } from "@/hooks/useAsync";
import { useLiveProgress } from "@/hooks/useLiveProgress";
import { useStore } from "@/hooks/useStore";
import { clay, colors, scale } from "@/theme";

const medalColors = [clay.butter.deep, "#A8A4B8", clay.peach.deep];

const Rank = ({ rank }: { rank: number }) =>
  rank <= 3 ? (
    <View style={styles.rank}>
      <Icon name="medal" size={24} color={medalColors[rank - 1]} strokeWidth={2.2} />
    </View>
  ) : (
    <Text style={styles.rankText}>{rank}</Text>
  );

export default function Leaderboard() {
  const { user } = useStore(container.auth);
  const { summary } = useLiveProgress();
  const { data, error, loading, reload } = useAsync(() => container.progress.leaderboard(), [summary?.totalPoints]);

  return (
    <Screen>
      <Display>Ranks</Display>
      <Body muted>Every lesson and solved problem moves you up.</Body>
      {loading ? <Loader /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {data?.length === 0 ? (
        <Glass>
          <Body>The board is empty. Finish one lesson and you're first on it.</Body>
        </Glass>
      ) : null}
      {data?.map((e) => {
        const me = e.userId === user?.id;
        return (
          <Glass key={e.userId} strong={me}>
            <Row style={styles.line}>
              <Rank rank={e.rank} />
              <View style={{ flex: 1 }}>
                <Body>{e.name}</Body>
              </View>
              <Chip tone={me ? "mint" : "white"}>{e.points} pts</Chip>
            </Row>
          </Glass>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  line: { flexWrap: "nowrap" },
  rank: { width: 40, alignItems: "center" },
  rankText: { ...scale.heading, color: colors.muted, width: 40, textAlign: "center" },
});
