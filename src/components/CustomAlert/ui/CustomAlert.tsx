import React, { useMemo } from 'react';
import { Animated, Modal, Pressable, ScrollView, View } from 'react-native';
import { Typography } from '../../Typography';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { useCustomAlert } from '../presenters/useCustomAlert';
import { getAlertAnimatedStyles, getStyles } from './styles';
import type { CustomAlertProps } from '../types/types';

export const CustomAlert = ({
    visible,
    onClose,
    header,
    children,
    footer,
    showHandle = false,
    closeAction,
    style,
    contentStyle,
}: CustomAlertProps) => {
    const { colors, spacing, radius } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(() => getStyles(colors, spacing, radius, scaling), [colors, radius, scaling, spacing]);
    const { isVisible, backdropOpacity, scaleAnim, onClosePress } = useCustomAlert({ visible, onClose });
    const { backdropStyle, alertStyle } = useMemo(
        () => getAlertAnimatedStyles(backdropOpacity, scaleAnim),
        [backdropOpacity, scaleAnim],
    );

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="none" statusBarTranslucent onRequestClose={onClosePress}>
            <View style={styles.modalContainer}>
                <Animated.View pointerEvents="none" style={[styles.backdrop, backdropStyle]} />
                <Pressable
                    accessible={false}
                    importantForAccessibility="no"
                    onPress={onClosePress}
                    style={styles.backdropTouch}
                />

                <Animated.View
                    accessibilityViewIsModal
                    onAccessibilityEscape={onClosePress}
                    style={[styles.alertContainer, alertStyle, style]}
                >
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        {showHandle ? <View style={styles.handle} /> : null}
                        {header != null || closeAction ? (
                            <View style={styles.header}>
                                <View style={styles.headerRow}>
                                    {typeof header === 'string' ? (
                                        <Typography text={header} variant="title" style={styles.headerText} />
                                    ) : header}
                                    {closeAction ? (
                                        <Pressable
                                            accessibilityRole="button"
                                            accessibilityLabel={closeAction.accessibilityLabel}
                                            accessibilityHint={closeAction.accessibilityHint}
                                            onPress={onClosePress}
                                            style={styles.closeButton}
                                        >
                                            {closeAction.icon}
                                        </Pressable>
                                    ) : null}
                                </View>
                            </View>
                        ) : null}
                        {children != null ? <View style={[styles.content, contentStyle]}>{children}</View> : null}
                        {footer != null ? <View style={styles.footer}>{footer}</View> : null}
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};
