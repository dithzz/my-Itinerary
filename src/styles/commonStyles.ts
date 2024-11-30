import { StyleSheet, Dimensions } from "react-native";

// Professional Color Palette
const COLORS = {
  // Modern, Sophisticated Color Scheme
  PRIMARY: "#2C3E50", // Deep Midnight Blue - Professional, Authoritative
  SECONDARY: "#34495E", // Soft Dark Blue - Complementary, Refined
  ACCENT: "#3498DB", // Bright Blue - Energy, Trustworthiness
  BACKGROUND: "#ECF0F1", // Light Silver-Gray - Clean, Minimalist
  WHITE: "#FFFFFF", // Crisp White - Clarity, Space
  TEXT_DARK: "#2C3E50", // Dark Blue for Text - Readability
  TEXT_LIGHT: "#34495E", // Soft Dark Blue for Secondary Text
  GRADIENT_START: "#2C3E50",
  GRADIENT_END: "#3498DB",
};

const { width } = Dimensions.get("window");

export const commonStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 16,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: COLORS.BACKGROUND,
  },

  formContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 15,
    elevation: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  tagline: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 24,
    lineHeight: 22,
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 30,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  inputContainer: {
    marginBottom: 15,
  },

  button: {
    marginBottom: 15,
    borderColor: COLORS.ACCENT,
    borderWidth: 1.5,
    borderRadius: 25,
  },

  clearButton: {
    marginTop: 20,
    alignSelf: "center",
    color: COLORS.ACCENT,
  },

  // Additional Professional Styling Utilities
  shadowStyle: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export const professionalTheme = {
  colors: COLORS,
};
