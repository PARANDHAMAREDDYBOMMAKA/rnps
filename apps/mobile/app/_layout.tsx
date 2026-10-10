import { useEffect } from "react";
import { AppState } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Fredoka_600SemiBold, Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { container } from "@/core/AppContainer";
import { exposeWebGlobals } from "@/core/webGlobals";
import { useStore } from "@/hooks/useStore";
import { Loader } from "@/components/ui";
import { colors } from "@/theme";

exposeWebGlobals();

export default function RootLayout() {
  const { ready, user } = useStore(container.auth);
  const [fontsReady] = useFonts({ Fredoka_600SemiBold, Fredoka_700Bold, Nunito_600SemiBold, Nunito_700Bold });

  useEffect(() => {
    void container.auth.bootstrap();
  }, []);

  useEffect(() => {
    if (!user) {
      container.progress.reset();
      return;
    }
    void container.progress.refresh();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void container.progress.refreshIfStale();
    });
    const timer = setInterval(() => void container.progress.refreshIfStale(25_000), 30_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, [user?.id]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {ready && fontsReady ? (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground }, animation: "fade" }}>
          <Stack.Protected guard={Boolean(user)}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="track/[id]" />
            <Stack.Screen name="lesson/[id]" />
            <Stack.Screen name="problem/[id]" />
            <Stack.Screen name="quiz/[id]" />
          </Stack.Protected>
          <Stack.Protected guard={!user}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      ) : (
        <Loader />
      )}
    </SafeAreaProvider>
  );
}
