import { Platform } from "react-native";

const FONT_FAMILY_REGULAR = Platform.select({
  ios: "System",
  android: "sans-serif"
});
const FONT_FAMILY_BOLD = Platform.select({
  ios: "System",
  android: "sans-serif-bold"
});
const FONT_FAMILY_MEDIUM = Platform.select({
  ios: "System",
  android: "sans-serif-medium"
});

export default {
  fontFamilyRegular: FONT_FAMILY_REGULAR,
  fontFamilyBold: FONT_FAMILY_BOLD,
  fontFamilyMedium: FONT_FAMILY_MEDIUM,

  h1: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 32,
    lineHeight: 40
  },
  h2: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 28,
    lineHeight: 36
  },
  h3: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 24,
    lineHeight: 32
  },
  h4: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 20,
    lineHeight: 28
  },
  body1: {
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: 16,
    lineHeight: 24
  },
  body2: {
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: 14,
    lineHeight: 20
  },
  caption: {
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: 12,
    lineHeight: 16
  },
  button: {
    fontFamily: FONT_FAMILY_MEDIUM,
    fontSize: 16,
    textTransform: "uppercase"
  }
};
