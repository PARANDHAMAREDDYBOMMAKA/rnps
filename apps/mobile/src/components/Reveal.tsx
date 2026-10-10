import { useEffect, useRef, type PropsWithChildren } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealProps {
  index?: number;
  style?: StyleProp<ViewStyle>;
  from?: number;
}

export const Reveal = ({ children, index = 0, style, from = 24 }: PropsWithChildren<RevealProps>) => {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const anim = Animated.spring(progress, { toValue: 1, delay: index * 90, friction: 7, tension: 60, useNativeDriver: true });
    anim.start();
    return () => anim.stop();
  }, [reduced, index, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [from, 0] });
  const scaleValue = progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return <Animated.View style={[style, { opacity: progress, transform: [{ translateY }, { scale: scaleValue }] }]}>{children}</Animated.View>;
};
