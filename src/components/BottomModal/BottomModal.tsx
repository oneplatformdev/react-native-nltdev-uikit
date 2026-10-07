import React, { useMemo } from 'react';
import { Animated, Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { Typography } from '../Typography';
import { useUITheme } from '../../theme';
import { useScaling } from '../../utils';
import { useBottomModalPresenter } from './BottomModalPresenter';
import { getStyles } from './styles';
import type { BottomModalProps } from './types';

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
}: BottomModalProps) => {
    const { colors, spacing, radius } = useUITheme();
    const scaling = useScaling();
    const {
        bottomInset,
        modalContentStyle,
        animatedBackdropStyle,
        onClosePress,
        onShow,
        panHandlers,
        animatedKeyboardContainerStyle,
        animatedKeyboardBackgroundStyle,
    } = useBottomModalPresenter({ onClose, closeRef, isFullScreen, shouldAvoidKeyboard });
    const styles = useMemo(
        () => getStyles(colors, spacing, radius, scaling, bottomInset),
        [bottomInset, colors, radius, scaling, spacing],
    );

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClosePress} onShow={onShow}>
            <View style={styles.modalContainer}>
                <Animated.View pointerEvents="none" style={[styles.backdrop, animatedBackdropStyle]} />
                <Reanimated.View pointerEvents="none" style={[styles.keyboardBackground, animatedKeyboardBackgroundStyle]} />
                <Pressable
                    accessible={false}
                    importantForAccessibility="no"
                    onPress={onClosePress}
                    style={StyleSheet.absoluteFill}
                />

                <Reanimated.View style={animatedKeyboardContainerStyle}>
                    <Animated.View
                        accessibilityViewIsModal
                        onAccessibilityEscape={onClosePress}
                        style={[styles.modalContent, modalContentStyle]}
                    >
                        <View style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
                            <View {...panHandlers}>
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
                                                    onPress={onClosePress}
                                                    style={styles.closeButton}
                                                >
                                                    {closeAction.icon}
                                                </Pressable>
                                            ) : <View style={styles.closeButton} />}
                                        </View>
                                    )}
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={[
                                styles.contentContainer,
                                isFullScreen && styles.fullScreenContentContainer,
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
