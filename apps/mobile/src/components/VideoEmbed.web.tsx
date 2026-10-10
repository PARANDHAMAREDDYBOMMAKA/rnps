import { StyleSheet, View } from "react-native";
import { radius } from "@/theme";

export const VideoEmbed = ({ videoId, title }: { videoId: string; title: string }) => (
  <View style={styles.frame}>
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      loading="lazy"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
    />
  </View>
);

const styles = StyleSheet.create({
  frame: { width: "100%", aspectRatio: 16 / 9, borderRadius: radius.panel, overflow: "hidden", backgroundColor: "#000" },
});
