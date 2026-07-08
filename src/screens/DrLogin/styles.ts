import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#d67031",
  primaryDark: "#251d50",
  success: "#16A34A",
  danger: "#DC2626",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: "#0F172A",
  secondaryText: "#64748B",
  border: "#CBD5E1",
  disabled: "#ccc",
  shadow: "#000000",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    fontSize: 60,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.secondaryText,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 24,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 28,
  },

  forgotText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  loginButton: {
    marginTop: 20,
    height: 46,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  loginDisabled: {
    backgroundColor: COLORS.disabled,
  },

  loginText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },

  version: {
    marginTop: 40,
    alignSelf: "center",
    color: COLORS.secondaryText,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rememberText: {
    marginLeft: 8,
    color: COLORS.secondaryText,
    fontSize: 14,
  },

  errorContainer: {
    marginTop: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 14,
  },

  successContainer: {
    marginTop: 12,
    backgroundColor: "#DCFCE7",
    borderRadius: 10,
    padding: 12,
  },

  successText: {
    color: COLORS.success,
    fontSize: 14,
  },

  divider: {
    marginVertical: 30,
    height: 1,
    backgroundColor: COLORS.border,
  },

  footer: {
    alignItems: "center",
    marginTop: 24,
  },

  footerText: {
    color: COLORS.secondaryText,
    fontSize: 14,
  },

  signupText: {
    marginTop: 8,
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },

  socialContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  socialButton: {
    width: (width - 80) / 3,
    height: 50,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: COLORS.border,

    justifyContent: "center",
    alignItems: "center",
  },
});