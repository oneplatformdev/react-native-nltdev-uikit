import { useMemo } from 'react';
import { Animated, Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { Typography } from '../../Typography';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { useBottomModal } from '../presenters/useBottomModal';
import type { BottomModalProps } from '../types/types';
import { getStyles, useBottomModalAnimatedStyles } from './styles';

export const BottomModal = ({
    visible,
    onClose,
    children,
    closeRef,
    title,
    titleVariant = 'title',
    customHeader,
    closeAction,
    contentContainerStyle,
    isFullScreen = false,
    shouldAvoidKeyboard = true,
    sizing,
    topInset,
    showHeader = true,
    backdrop,
    cornerRadius,
    dragToDismiss = 'handle',
    onCloseRequest,
    onDismiss,
}: BottomModalProps) => {
    const { colors, spacing, radius } = useUITheme();
    const scaling = useScaling();
    const backdropOptions = backdrop === false ? undefined : backdrop;
    const backdropColor = backdropOptions?.color ?? colors.text;
    const targetBackdropOpacity = backdropOptions?.opacity !== undefined && Number.isFinite(backdropOptions.opacity)
        ? Math.min(1, Math.max(0, backdropOptions.opacity)) : 0.5;
    const dismissOnBackdropPress = backdropOptions?.dismissOnPress ?? true;
    const resolvedCornerRadius = cornerRadius !== undefined && Number.isFinite(cornerRadius)
        ? Math.max(0, cornerRadius) : undefined;
    const {
        bottomInset,
        height,
        topInset: resolvedTopInset,
        translateY,
        backdropOpacity,
        expandableHeight,
        isExpandable,
        onCloseAction,
        onBackdropPress,
        onHardwareBack,
        onShow,
        panHandlers,
    } = useBottomModal({ visible, onClose, onCloseRequest, onDismiss, closeRef, topInset, sizing, dragToDismiss });

    const {
        modalContentStyle,
        animatedBackdropStyle,
        animatedKeyboardContainerStyle,
        animatedKeyboardBackgroundStyle,
        isBoundedHeight,
    } = useBottomModalAnimatedStyles(
        height, resolvedTopInset, bottomInset, translateY, backdropOpacity,
        isFullScreen, shouldAvoidKeyboard, sizing, targetBackdropOpacity, expandableHeight,
    );

    if (__DEV__ && isExpandable && !showHeader) {
        throw new Error('BottomModal expandable sizing requires showHeader=true for its resize gesture.');
    }

    const styles = useMemo(
        () => getStyles(colors, spacing, radius, scaling, bottomInset, backdropColor, resolvedCornerRadius),
        [backdropColor, bottomInset, colors, radius, resolvedCornerRadius, scaling, spacing],
    );

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent
            onRequestClose={onHardwareBack} onShow={onShow}>
            <View style={styles.modalContainer}>
                {backdrop !== false ? (
                    <>
                        <Animated.View pointerEvents="none" style={[styles.backdrop, animatedBackdropStyle]} />
                        {dismissOnBackdropPress ? (
                            <Pressable accessible={false} importantForAccessibility="no"
                                onPress={onBackdropPress} style={StyleSheet.absoluteFill} />
                        ) : null}
                    </>
                ) : null}
                <Reanimated.View pointerEvents="none" style={[styles.keyboardBackground, animatedKeyboardBackgroundStyle]} />

                <Reanimated.View style={animatedKeyboardContainerStyle}>
                    <Animated.View
                        accessibilityViewIsModal
                        onAccessibilityEscape={onCloseAction}
                        style={[styles.modalContent, modalContentStyle]}
                    >
                        <View style={[styles.container, isBoundedHeight && styles.fullScreenContainer]}>
                            {showHeader ? <View {...(isExpandable || dragToDismiss === 'handle' ? panHandlers : {})}>
                                <TouchableWithoutFeedback>
                                    {customHeader ? (
                                        <View>{customHeader}</View>
                                    ) : (
                                        <View style={styles.header}>
                                            <View style={styles.closeButton} />
                                            {title ? (
                                                <View style={styles.titleContainer} pointerEvents="none">
                                                    <Typography text={title} variant={titleVariant} style={styles.title} />
                                                </View>
                                            ) : null}
                                            {closeAction ? (
                                                <Pressable
                                                    accessibilityRole="button"
                                                    accessibilityLabel={closeAction.accessibilityLabel}
                                                    accessibilityHint={closeAction.accessibilityHint ?? title}
                                                    onPress={onCloseAction}
                                                    style={styles.closeButton}
                                                >
                                                    {closeAction.icon}
                                                </Pressable>
                                            ) : <View style={styles.closeButton} />}
                                        </View>
                                    )}
                                </TouchableWithoutFeedback>
                            </View> : null}
                            <View style={[
                                styles.contentContainer,
                                isBoundedHeight && styles.boundedContentContainer,
                                contentContainerStyle,
                            ]}>
                                {children}
                            </View>
                        </View>
                    </Animated.View>
                </Reanimated.View>
            </View>
        </Modal>
    );
};
