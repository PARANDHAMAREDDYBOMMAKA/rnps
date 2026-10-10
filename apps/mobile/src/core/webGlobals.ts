import { Platform } from "react-native";
import * as React from "react";

export const exposeWebGlobals = (): void => {
  if (Platform.OS !== "web") return;
  const g = globalThis as Record<string, unknown>;
  g.React = React;
  g.__SKILLUP__ = { framework: "Expo", renderer: "react-native-web" };
};
