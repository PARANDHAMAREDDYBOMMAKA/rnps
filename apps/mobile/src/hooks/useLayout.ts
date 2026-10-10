import { useWindowDimensions } from "react-native";

export interface Layout {
  width: number;
  compact: boolean;
  wide: boolean;
  columns: 1 | 2;
}

export const useLayout = (): Layout => {
  const { width } = useWindowDimensions();
  return { width, compact: width < 480, wide: width >= 900, columns: width >= 900 ? 2 : 1 };
};
