import { useCallback, useMemo } from "react";
import type {
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useUITheme } from "../../theme";
import { useScaling } from "../../utils";
import { getStyles } from "./styles";
import type { ButtonProps } from "./types";

type ButtonPresenterProps = Pick<
  ButtonProps,
  | "accessibilityLabel"
  | "accessibilityRole"
  | "accessibilityState"
  | "children"
  | "text"
  | "disabled"
  | "fullWidth"
  | "labelProps"
  | "loading"
  | "loadingAppearance"
  | "loadingIndicatorColor"
  | "size"
  | "style"
  | "variant"
>;

export const useButtonPresenter = ({
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  children,
  text,
  disabled,
  fullWidth,
  labelProps,
  loading,
  loadingAppearance,
  loadingIndicatorColor,
  size,
  style,
  variant,
}: ButtonPresenterProps) => {
  const { button, colors } = useUITheme();
  const scaling = useScaling();
  const variantTheme = button.variants[variant ?? "primary"];
  const sizeTheme = button.sizes[size ?? "md"];
  const interactionDisabled = Boolean(disabled || loading);
  const visuallyDisabled = Boolean(
    disabled || (loading && loadingAppearance === "disabled")
  );
  const textColor = visuallyDisabled
    ? variantTheme.disabledForeground
    : variantTheme.foreground;
  const styles = useMemo(
    () => getStyles(colors, scaling, variantTheme, sizeTheme),
    [colors, scaling, sizeTheme, variantTheme]
  );
  const resolveStyle = useCallback(
    ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => {
      const callerStyle =
        typeof style === "function" ? style({ pressed }) : style;

      return [
        styles.container,
        pressed && !interactionDisabled && styles.pressed,
        visuallyDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        callerStyle,
      ];
    },
    [fullWidth, interactionDisabled, style, styles, visuallyDisabled]
  );
  const content = text ?? children;
  const isTextChild =
    typeof content === "string" || typeof content === "number";

  return {
    content,
    interactionDisabled,
    isTextChild,
    labelColor: labelProps?.color ?? textColor,
    labelNumberOfLines: labelProps?.numberOfLines ?? button.numberOfLines,
    labelVariant: labelProps?.variant ?? sizeTheme.labelVariant,
    labelWeight: labelProps?.weight ?? sizeTheme.labelWeight,
    loaderColor: loading
      ? loadingIndicatorColor ?? colors[textColor]
      : undefined,
    resolvedAccessibilityLabel:
      accessibilityLabel ?? (isTextChild ? String(content) : undefined),
    resolvedAccessibilityRole: accessibilityRole ?? "button",
    resolvedAccessibilityState: {
      ...accessibilityState,
      disabled: interactionDisabled,
      busy: loading,
    },
    resolveStyle,
    styles,
  };
};
