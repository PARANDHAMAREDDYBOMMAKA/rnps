export const colors = {
  ground: "#EFEBFF",
  groundDeep: "#E2DCFA",
  ink: "#2A2552",
  muted: "#6B6590",
  faint: "#A49ECB",
  blobLavender: "#C9BDFF",
  blobMint: "#BFF2DD",
  blobPeach: "#FFD3BF",
  blobSky: "#C4E4FF",
  dot: "#B9B1E6",
  glass: "rgba(255,255,255,0.55)",
  glassStrong: "rgba(255,255,255,0.72)",
  glassEdge: "rgba(255,255,255,0.95)",
  mint: "#5FCFA5",
  rose: "#F0789A",
  roseDeep: "#C84A6E",
} as const;

export type ClayTone = "lavender" | "mint" | "butter" | "peach" | "sky" | "ink" | "white";

export interface ClayPalette {
  base: string;
  deep: string;
  text: string;
}

export const clay: Record<ClayTone, ClayPalette> = {
  lavender: { base: "#B4A7FF", deep: "#8E7CF0", text: colors.ink },
  mint: { base: "#A5EFD1", deep: "#5FCFA5", text: "#0F3B2C" },
  butter: { base: "#FFE48C", deep: "#E8C04A", text: "#4A3A00" },
  peach: { base: "#FFC3A4", deep: "#F09A6C", text: "#4A2410" },
  sky: { base: "#B6DDFF", deep: "#7FBCF5", text: "#0E2F4C" },
  ink: { base: "#2A2552", deep: "#15122F", text: "#FFFFFF" },
  white: { base: "#FFFFFF", deep: "#CFC8F2", text: colors.ink },
};

export const difficultyTone = (difficulty: string): ClayTone => (difficulty === "hard" ? "peach" : difficulty === "medium" ? "butter" : "sky");

export const fonts = {
  display: "Fredoka_600SemiBold",
  displayBold: "Fredoka_700Bold",
  body: "Nunito_600SemiBold",
  bodyBold: "Nunito_700Bold",
} as const;

export const scale = {
  hero: { fontFamily: fonts.displayBold, fontSize: 44, lineHeight: 48, letterSpacing: -0.5, color: colors.ink },
  display: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 36, color: colors.ink },
  heading: { fontFamily: fonts.display, fontSize: 21, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 25, color: colors.ink },
  small: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 18, color: colors.muted },
  stat: { fontFamily: fonts.displayBold, fontSize: 36, lineHeight: 40, color: colors.ink },
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, xxl: 64 } as const;

export const radius = { chip: 999, control: 18, panel: 28, tile: 34 } as const;

export const clayShadow = (p: ClayPalette, lifted = false): string =>
  `inset 4px 4px 10px rgba(255,255,255,0.65), inset -6px -7px 14px ${p.deep}, 0 ${lifted ? 26 : 18}px ${lifted ? 40 : 30}px -14px ${p.deep}`;

export const clayPressedShadow = (p: ClayPalette): string =>
  `inset -2px -2px 6px rgba(255,255,255,0.45), inset 6px 7px 14px ${p.deep}, 0 6px 12px -10px ${p.deep}`;

export const glassShadow = "inset 0 1px 0 rgba(255,255,255,0.9), 0 24px 48px -28px rgba(76,60,160,0.45)";

export const grooveShadow = "inset 3px 3px 7px rgba(76,60,160,0.22), inset -2px -2px 4px rgba(255,255,255,0.8)";
