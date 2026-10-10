import { Tabs } from "expo-router";
import { StyleSheet, View, type ColorValue } from "react-native";
import { Frost } from "@/components/Frost";
import { Icon, type IconName } from "@/components/Icon";
import { useLayout } from "@/hooks/useLayout";
import { colors, fonts, space } from "@/theme";

const tabIcon = (name: IconName) => ({ focused, color }: { focused: boolean; color: ColorValue }) => (
  <View style={[styles.iconWrap, focused && styles.iconFocused]}>
    <Icon name={name} size={20} color={String(color)} strokeWidth={focused ? 2.4 : 2} />
  </View>
);

export default function TabsLayout() {
  const { wide } = useLayout();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.ground },
        tabBarPosition: wide ? "left" : "bottom",
        tabBarVariant: wide ? "material" : "uikit",
        tabBarLabelPosition: wide ? "below-icon" : undefined,
        tabBarStyle: wide ? styles.rail : styles.bar,
        tabBarItemStyle: wide ? styles.railItem : styles.barItem,
        tabBarBackground: () => <Frost intensity={40} style={StyleSheet.absoluteFill} />,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.bodyBold, fontSize: wide ? 12 : 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Today", tabBarIcon: tabIcon("flame") }} />
      <Tabs.Screen name="tracks" options={{ title: "Learn", tabBarIcon: tabIcon("book") }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Ranks", tabBarIcon: tabIcon("trophy") }} />
      <Tabs.Screen name="profile" options={{ title: "You", tabBarIcon: tabIcon("user") }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: "rgba(255,255,255,0.55)", borderTopColor: colors.glassEdge, borderTopWidth: 1.5, paddingTop: 6, elevation: 0 },
  rail: { backgroundColor: "rgba(255,255,255,0.45)", borderRightColor: colors.glassEdge, borderRightWidth: 1.5, width: 104, paddingTop: space.lg },
  railItem: { paddingVertical: space.sm },
  barItem: { paddingVertical: 4 },
  iconWrap: { width: 40, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  iconFocused: { backgroundColor: colors.groundDeep },
});
