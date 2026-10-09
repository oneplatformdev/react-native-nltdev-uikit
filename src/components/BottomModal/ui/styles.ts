import { useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import type { UIColors, UIRadius, UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';

export const getStyles = (
    colors: UIColors,
    spacing: UISpacing,
    radius: UIRadius,
    scaling: ScalingFunctions,
    bottomInset: number,
) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.text,
        },
        keyboardBackground: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: scaling.scaleHorizontal(radius.lg),
            borderTopRightRadius: scaling.scaleHorizontal(radius.lg),
            overflow: 'hidden',
            flexShrink: 1,
        },
        container: {
            overflow: 'hidden',
            flexShrink: 1,
        },
        fullScreenContainer: {
            flex: 1,
            minHeight: 0,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingTop: scaling.scaleVertical(spacing.lg),
            position: 'relative',
        },
        titleContainer: {
            flex: 1,
            flexShrink: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: scaling.scaleVertical(spacing.sm),
        },
        closeButton: {
            width: scaling.scaleHorizontal(40),
            height: scaling.scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            textAlign: 'center',
            color: colors.text,
        },
        contentContainer: {
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingBottom: bottomInset + scaling.scaleVertical(spacing.lg),
            flexShrink: 1,
        },
        fullScreenContentContainer: {
            flex: 1,
            minHeight: 0,
        },
    });

    return styles;
};

export const useBottomModalAnimatedStyles = (
    height: number,
    topInset: number,
    bottomInset: number,
    translateY: Animated.Value,
    backdropOpacity: Animated.Value,
    isFullScreen: boolean,
    shouldAvoidKeyboard: boolean,
) => {
    const maxHeight = height - topInset;
    const { height: keyboardHeight } = useAnimatedKeyboard();
    const animatedBackdropStyle = useMemo(
        () => ({ opacity: backdropOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }),
        [backdropOpacity],
    );
    const animatedKeyboardContainerStyle = useAnimatedStyle(() => {
        if (!shouldAvoidKeyboard) return { marginBottom: 0, maxHeight };
        const keyboardOffset = Math.max(keyboardHeight.value - bottomInset, 0);
        return { marginBottom: keyboardOffset, maxHeight: Math.max(maxHeight - keyboardOffset, 0) };
    });
    const animatedKeyboardBackgroundStyle = useAnimatedStyle(() => ({
        height: shouldAvoidKeyboard ? Math.max(keyboardHeight.value - bottomInset, 0) : 0,
    }));
    const modalContentStyle = useMemo<ViewStyle>(
        () => ({ maxHeight, height: isFullScreen ? maxHeight : undefined, transform: [{ translateY }] }),
        [isFullScreen, maxHeight, translateY],
    );

    return { animatedBackdropStyle, animatedKeyboardContainerStyle, animatedKeyboardBackgroundStyle, modalContentStyle };
};
