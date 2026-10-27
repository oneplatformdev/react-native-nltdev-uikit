import { useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import type { UIColors, UIRadius, UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';
import type { BottomModalSizing } from '../types/types';

export const getStyles = (
    colors: UIColors,
    spacing: UISpacing,
    radius: UIRadius,
    scaling: ScalingFunctions,
    bottomInset: number,
    backdropColor: string,
    cornerRadius?: number,
) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: backdropColor,
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
            borderTopLeftRadius: scaling.scaleHorizontal(cornerRadius ?? radius.lg),
            borderTopRightRadius: scaling.scaleHorizontal(cornerRadius ?? radius.lg),
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
        boundedContentContainer: {
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
    sizing?: BottomModalSizing,
    targetBackdropOpacity = 0.5,
    expandableHeight?: Animated.Value,
) => {
    const maxHeight = Math.max(0, height - topInset);
    const mode = sizing?.mode ?? (isFullScreen ? 'fullscreen' : 'content');
    const fraction = sizing?.mode === 'fixed' ? sizing.fraction : undefined;
    const validFraction = fraction !== undefined && Number.isFinite(fraction) && fraction > 0 && fraction <= 1;
    if (__DEV__ && sizing?.mode === 'fixed' && !validFraction) {
        throw new Error('BottomModal fixed fraction must be finite and greater than 0 and at most 1.');
    }
    const resolvedFraction = fraction !== undefined && Number.isFinite(fraction) && fraction > 0
        ? Math.min(1, fraction) : 0.5;
    const modalHeight = mode === 'fullscreen' ? maxHeight
        : mode === 'fixed' ? maxHeight * resolvedFraction : undefined;
    const isBoundedHeight = modalHeight !== undefined || mode === 'expandable';
    const { height: keyboardHeight } = useAnimatedKeyboard();
    const animatedBackdropStyle = useMemo(
        () => ({ opacity: backdropOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, targetBackdropOpacity] }) }),
        [backdropOpacity, targetBackdropOpacity],
    );
    const animatedKeyboardContainerStyle = useAnimatedStyle(() => {
        if (!shouldAvoidKeyboard) return { marginBottom: 0, maxHeight };
        const keyboardOffset = Math.max(keyboardHeight.value - bottomInset, 0);
        return { marginBottom: keyboardOffset, maxHeight: Math.max(maxHeight - keyboardOffset, 0) };
    });
    const animatedKeyboardBackgroundStyle = useAnimatedStyle(() => ({
        height: shouldAvoidKeyboard ? Math.max(keyboardHeight.value - bottomInset, 0) : 0,
    }));
    const modalContentStyle = useMemo(
        () => ({
            maxHeight,
            height: mode === 'expandable' ? expandableHeight : modalHeight,
            transform: [{ translateY }],
        }),
        [expandableHeight, maxHeight, modalHeight, mode, translateY],
    );

    return { animatedBackdropStyle, animatedKeyboardContainerStyle, animatedKeyboardBackgroundStyle, modalContentStyle, isBoundedHeight };
};
