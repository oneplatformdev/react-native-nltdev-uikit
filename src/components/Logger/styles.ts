import { StyleSheet } from "react-native";
import type { UIColors, UIRadius, UISpacing } from "../../theme";
import type { ScalingFunctions } from "../../utils";

export const getStyles = (
  colors: UIColors,
  spacing: UISpacing,
  radius: UIRadius,
  scaling: ScalingFunctions
) => {
  return StyleSheet.create({
    launcher: {
      position: "absolute",
      right: scaling.scaleHorizontal(spacing.lg),
      bottom: scaling.scaleVertical(spacing.lg * 7),
      zIndex: 10,
      padding: scaling.scaleVertical(spacing.sm),
      borderRadius: scaling.scaleHorizontal(radius.lg),
      borderWidth: scaling.scaleHorizontal(1),
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
      paddingVertical: scaling.scaleVertical(spacing.sm),
      gap: scaling.scaleHorizontal(spacing.sm),
    },
    headerTitle: {
      flex: 1,
    },
    headerAction: {
      paddingHorizontal: scaling.scaleHorizontal(spacing.sm),
      paddingVertical: scaling.scaleVertical(spacing.sm),
    },
    actionText: { color: colors.primary },
    list: {
      flex: 1,
      borderTopWidth: scaling.scaleVertical(1),
      borderTopColor: colors.border,
    },
    listContent: {
      flexGrow: 1,
      paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
      paddingBottom: scaling.scaleVertical(spacing.lg),
    },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: scaling.scaleHorizontal(spacing.lg),
    },
    card: {
      marginTop: scaling.scaleVertical(spacing.md),
      paddingHorizontal: scaling.scaleHorizontal(spacing.md),
      paddingVertical: scaling.scaleVertical(spacing.sm),
      borderRadius: scaling.scaleHorizontal(radius.sm),
      borderWidth: scaling.scaleHorizontal(1),
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    cardTitle: {
      marginBottom: scaling.scaleVertical(spacing.xs),
    },
    section: {
      borderLeftWidth: scaling.scaleHorizontal(3),
      paddingLeft: scaling.scaleHorizontal(spacing.sm),
    },
    divider: {
      height: scaling.scaleVertical(1),
      backgroundColor: colors.border,
      marginVertical: scaling.scaleVertical(spacing.sm),
    },
    sectionButton: {
      flex: 1,
      minHeight: scaling.scaleVertical(36),
      flexDirection: "row",
      alignItems: "center",
      gap: scaling.scaleHorizontal(spacing.sm),
    },
    sectionRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    sectionTitle: {
      flex: 1,
    },
    paramsRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    paramsText: {
      flex: 1,
      minWidth: 0,
    },
    copyButton: {
      minHeight: scaling.scaleVertical(36),
      justifyContent: "center",
      paddingHorizontal: scaling.scaleHorizontal(spacing.sm),
    },
    copyButtonTop: {
      minHeight: scaling.scaleVertical(36),
      justifyContent: "flex-start",
      paddingTop: scaling.scaleVertical(spacing.xs),
      paddingHorizontal: scaling.scaleHorizontal(spacing.sm),
    },
    emptySection: {
      height: scaling.scaleVertical(spacing.sm),
    },
    message: {
      color: colors.textMuted,
      marginTop: scaling.scaleVertical(spacing.xs),
      marginBottom: scaling.scaleVertical(spacing.sm),
    },
  });
};
