import { forwardRef, memo } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import type { PressableInstance } from "react-native";
import { Typography } from "../Typography";
import { useButtonPresenter } from "./ButtonPresenter";
import type { ButtonProps } from "./types";

const ButtonComponent = forwardRef<PressableInstance, ButtonProps>(
  (
    {
      accessibilityLabel,
      accessibilityRole,
      accessibilityState,
      children,
      text,
      disabled = false,
      fullWidth = false,
      labelProps,
      leftIcon,
      loading = false,
      loadingAppearance = "active",
      loadingIndicatorColor,
      rightIcon,
      size = "md",
      style,
      variant = "primary",
      ...props
    },
    ref
  ) => {
    const {
      content,
      interactionDisabled,
      isTextChild,
      labelColor,
      labelNumberOfLines,
      labelVariant,
      labelWeight,
      loaderColor,
      resolvedAccessibilityLabel,
      resolvedAccessibilityRole,
      resolvedAccessibilityState,
      resolveStyle,
      styles,
    } = useButtonPresenter({
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
    });

    return (
      <Pressable
        {...props}
        ref={ref}
        accessibilityLabel={resolvedAccessibilityLabel}
        accessibilityRole={resolvedAccessibilityRole}
        accessibilityState={resolvedAccessibilityState}
        disabled={interactionDisabled}
        style={resolveStyle}
      >
        <View
          accessibilityElementsHidden={loading}
          importantForAccessibility={loading ? "no-hide-descendants" : "auto"}
          style={[styles.content, loading && styles.hidden]}
        >
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          {isTextChild ? (
            <Typography
              {...labelProps}
              numberOfLines={labelNumberOfLines}
              color={labelColor}
              variant={labelVariant}
              weight={labelWeight}
              style={[styles.text, labelProps?.style]}
            >
              {content}
            </Typography>
          ) : (
            content
          )}
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>

        {loading ? (
          <View pointerEvents="none" style={styles.loader}>
            <ActivityIndicator color={loaderColor} size="small" />
          </View>
        ) : null}
      </Pressable>
    );
  }
);

ButtonComponent.displayName = "Button";

export const Button = memo(ButtonComponent);
