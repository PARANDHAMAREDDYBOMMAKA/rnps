import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="generator" content="Expo" />
        <meta name="application-name" content="SkillUp" />
        <meta name="description" content="Short lessons and real interview questions for engineering students. Ten minutes a day." />
        <meta name="theme-color" content="#EFEBFF" />
        <meta name="color-scheme" content="light" />
        <meta property="og:title" content="SkillUp" />
        <meta property="og:description" content="Build interview skills one block at a time." />
        <meta property="og:type" content="website" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@600;700&display=swap" rel="stylesheet" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const css = `
html, body { background: #EFEBFF; }
body { overscroll-behavior-y: none; -webkit-font-smoothing: antialiased; }
*:focus-visible { outline: 3px solid #8E7CF0; outline-offset: 2px; border-radius: 12px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;
