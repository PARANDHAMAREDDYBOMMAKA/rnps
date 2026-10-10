import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { radius } from "@/theme";

const page = (videoId: string, title: string) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<style>html,body{margin:0;background:#000;height:100%;overflow:hidden}iframe{position:absolute;inset:0;width:100%;height:100%;border:0}</style>
</head>
<body>
<iframe
  src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=https://skillup.app"
  title="${title.replace(/"/g, "&quot;")}"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen></iframe>
</body>
</html>`;

export const VideoEmbed = ({ videoId, title }: { videoId: string; title: string }) => (
  <View style={styles.frame}>
    <WebView
      source={{ html: page(videoId, title), baseUrl: "https://skillup.app" }}
      originWhitelist={["*"]}
      allowsFullscreenVideo
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled
      domStorageEnabled
      mixedContentMode="always"
      style={styles.web}
    />
  </View>
);

const styles = StyleSheet.create({
  frame: { width: "100%", aspectRatio: 16 / 9, borderRadius: radius.panel, overflow: "hidden", backgroundColor: "#000" },
  web: { flex: 1, backgroundColor: "#000" },
});
