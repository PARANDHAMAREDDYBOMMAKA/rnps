import { useState, type PropsWithChildren, type ReactNode } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Backdrop } from "./Backdrop";
import { Frost } from "./Frost";
import {
  clay,
  clayPressedShadow,
  clayShadow,
  colors,
  glassShadow,
  grooveShadow,
  radius,
  scale,
  space,
  type ClayTone,
} from "@/theme";

export const Screen = ({ children, scroll = true, wide = false }: PropsWithChildren<{ scroll?: boolean; wide?: boolean }>) => (
  <View style={styles.root}>
    <Backdrop />
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, wide && styles.wide]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, wide && styles.wide]}>{children}</View>
      )}
    </SafeAreaView>
  </View>
);

type TextProps = PropsWithChildren<{ style?: StyleProp<TextStyle>; muted?: boolean }>;

export const Hero = ({ children, style }: TextProps) => <Text style={[scale.hero, style]}>{children}</Text>;
export const Display = ({ children, style }: TextProps) => <Text style={[scale.display, style]}>{children}</Text>;
export const Heading = ({ children, style }: TextProps) => <Text style={[scale.heading, style]}>{children}</Text>;
export const Body = ({ children, style, muted }: TextProps) => <Text style={[scale.body, muted && styles.muted, style]}>{children}</Text>;
export const Small = ({ children, style }: TextProps) => <Text style={[scale.small, style]}>{children}</Text>;

interface GlassProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  inner?: StyleProp<ViewStyle>;
  strong?: boolean;
}

export const Glass = ({ children, onPress, style, inner, strong }: PropsWithChildren<GlassProps>) => (
  <Pressable onPress={onPress} disabled={!onPress} style={({ pressed, hovered }) => [styles.glassWrap, hovered && onPress && styles.hoverLift, pressed && styles.pressedFade, style]}>
    <Frost intensity={strong ? 50 : 30} style={[styles.glass, strong && styles.glassStrong, inner]}>
      {children}
    </Frost>
  </Pressable>
);

interface ClayProps {
  tone?: ClayTone;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  round?: keyof typeof radius;
}

export const Clay = ({ children, tone = "lavender", onPress, disabled, style, round = "control" }: PropsWithChildren<ClayProps>) => {
  const p = clay[tone];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed, hovered }) => [
        styles.clay,
        { backgroundColor: p.base, borderRadius: radius[round], boxShadow: pressed ? clayPressedShadow(p) : clayShadow(p, hovered && Boolean(onPress)) },
        hovered && onPress && !pressed && styles.hoverLift,
        pressed && styles.pressedSink,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  tone?: ClayTone;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({ label, onPress, loading, disabled, tone = "ink", style }: ButtonProps) => (
  <Clay tone={tone} onPress={onPress} disabled={disabled || loading} style={[styles.button, style]}>
    {loading ? <ActivityIndicator color={clay[tone].text} /> : <Text style={[scale.heading, { color: clay[tone].text }]}>{label}</Text>}
  </Clay>
);

export const TextButton = ({ label, onPress, style }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle> }) => (
  <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.textButton, pressed && styles.pressedFade, style]}>
    <Text style={[scale.small, styles.link]}>{label}</Text>
  </Pressable>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <Circle cx={12} cy={12} r={3} />
    {open ? null : <Path d="M4 4l16 16" />}
  </Svg>
);

export const Input = ({ label, style, secureTextEntry, ...props }: TextInputProps & { label: string }) => {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  return (
    <View style={styles.field}>
      <Small>{label}</Small>
      <View>
        <TextInput placeholderTextColor={colors.faint} secureTextEntry={hidden} style={[styles.input, secureTextEntry && styles.inputWithEye, style]} {...props} />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            style={({ pressed }) => [styles.eye, pressed && styles.pressedFade]}
          >
            <EyeIcon open={!hidden} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export const Chip = ({ children, tone = "white" }: { children: ReactNode; tone?: ClayTone }) => (
  <Clay tone={tone} round="chip" style={styles.chip}>
    <Text style={[scale.small, { color: clay[tone].text }]}>{children}</Text>
  </Clay>
);

export const ProgressBar = ({ value, tone = "mint" }: { value: number; tone?: ClayTone }) => {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View style={styles.groove}>
      {pct > 0 ? <Clay tone={tone} round="chip" style={[styles.fill, { width: `${Math.max(pct, 7)}%` }]} /> : null}
    </View>
  );
};

export const Loader = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color={clay.lavender.deep} />
  </View>
);

export const ErrorBox = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <View style={styles.error}>
    <Body style={{ color: colors.roseDeep }}>{message}</Body>
    {onRetry ? <Button label="Try again" onPress={onRetry} tone="white" /> : null}
  </View>
);

export const Row = ({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) => <View style={[styles.row, style]}>{children}</View>;

export const Gap = ({ size = "md" }: { size?: keyof typeof space }) => <View style={{ height: space[size] }} />;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ground },
  safe: { flex: 1 },
  content: { padding: space.md, paddingBottom: space.xl, gap: space.md, flexGrow: 1, maxWidth: 720, width: "100%", alignSelf: "center" },
  wide: { maxWidth: 1080 },
  muted: { color: colors.muted },
  link: { color: colors.ink, textDecorationLine: "underline" },
  glassWrap: { borderRadius: radius.panel, boxShadow: glassShadow },
  pressedFade: { opacity: 0.8 },
  glass: {
    borderRadius: radius.panel,
    overflow: "hidden",
    backgroundColor: colors.glass,
    borderWidth: 1.5,
    borderColor: colors.glassEdge,
    padding: space.md,
    gap: space.sm,
  },
  glassStrong: { backgroundColor: colors.glassStrong },
  clay: { alignItems: "center", justifyContent: "center", paddingHorizontal: space.md, paddingVertical: 14 },
  pressedSink: { transform: [{ translateY: 2 }] },
  hoverLift: { transform: [{ translateY: -3 }] },
  disabled: { opacity: 0.5 },
  button: { minHeight: 56 },
  textButton: { alignSelf: "flex-start", paddingVertical: space.sm },
  field: { gap: space.xs },
  input: {
    ...scale.body,
    backgroundColor: colors.groundDeep,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: Platform.OS === "web" ? 14 : 12,
    boxShadow: grooveShadow,
  },
  inputWithEye: { paddingRight: 52 },
  eye: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
  chip: { paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start" },
  groove: { height: 18, borderRadius: radius.chip, backgroundColor: colors.groundDeep, boxShadow: grooveShadow, padding: 3 },
  fill: { height: "100%", paddingVertical: 0, paddingHorizontal: 0 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },
  error: { backgroundColor: "#FFE4EC", borderRadius: radius.control, padding: space.md, gap: space.sm },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm, flexWrap: "wrap" },
});
