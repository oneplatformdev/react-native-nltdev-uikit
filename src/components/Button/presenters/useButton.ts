import { useUITheme } from "../../../theme";
import type { ButtonProps } from "../types/types";

type UseButtonProps = Pick<
  ButtonProps,
  | "accessibilityLabel"
  | "accessibilityRole"
  | "accessibilityState"
  | "children"
  | "text"
  | "disabled"
  | "labelProps"
  | "loading"
  | "loadingAppearance"
  | "loadingIndicatorColor"
  | "size"
  | "variant"
>;

export const useButton = ({
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  children,
  text,
  disabled,
  labelProps,
  loading,
  loadingAppearance,
  loadingIndicatorColor,
  size,
  variant,
}: UseButtonProps) => {
  const { button, colors } = useUITheme();
  const variantTheme = button.variants[variant ?? "primary"];
  const sizeTheme = button.sizes[size ?? "md"];
  const interactionDisabled = Boolean(disabled || loading);
  const visuallyDisabled = Boolean(
    disabled || (loading && loadingAppearance === "disabled")
  );
  const textColor = visuallyDisabled
    ? variantTheme.disabledForeground
    : variantTheme.foreground;
  const content = text ?? children;
  const isTextChild =
    typeof content === "string" || typeof content === "number";

  return {
    content,
    colors,
    interactionDisabled,
    isTextChild,
    labelColor: labelProps?.color ?? textColor,
    labelNumberOfLines: labelProps?.numberOfLines ?? button.numberOfLines,
    labelVariant: labelProps?.variant ?? sizeTheme.labelVariant,
    labelWeight: labelProps?.weight ?? sizeTheme.labelWeight,
    sizeTheme,
    variantTheme,
    visuallyDisabled,
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
  };
};
