import type { PropsWithChildren } from "react";
import { Platform, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

interface FrostProps {
  intensity?: number;
  style?: StyleProp<ViewStyle>;
}

export const Frost = ({ children, intensity = 30, style }: PropsWithChildren<FrostProps>) =>
  Platform.OS === "web" ? (
    <BlurView intensity={intensity} tint="light" style={style}>
      {children}
    </BlurView>
  ) : (
    <View style={[style, { backgroundColor: "rgba(255,255,255,0.78)" }]}>{children}</View>
  );
