import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { Typography } from '../../Typography';
import { useHeaderWithBackButton } from '../presenters/useHeaderWithBackButton';
import { getStyles } from './styles';
import type { HeaderWithBackButtonProps } from '../types/types';

export const HeaderWithBackButton = ({
    title,
    titleComponent,
    subtitle,
    onBackPress,
    backIcon,
    backButtonSize = 18,
    backAccessibilityLabel,
    backAccessibilityHint,
    backVisible = true,
    backDisabled = false,
    rightAccessory,
    titleAlign = 'left',
    titleVariant = 'h3',
    titleSize,
    titleNumberOfLines = 1,
    subtitleVariant = 'caption',
    subtitleSize,
    subtitleNumberOfLines = 1,
    style,
    contentStyle,
}: HeaderWithBackButtonProps) => {
    const { colors, spacing } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(
        () => getStyles(colors, spacing, scaling, backButtonSize),
        [backButtonSize, colors, spacing, scaling],
    );
    const { leftWidth, rightWidth, setLeftWidth, setRightWidth, centered, availableCentered, leftGuard, rightGuard } =
        useHeaderWithBackButton(titleAlign, backVisible);
    const customTitleIsNode = titleComponent != null && typeof titleComponent !== 'boolean' &&
        typeof titleComponent !== 'string' && typeof titleComponent !== 'number';
    const titleText = typeof titleComponent === 'string' || typeof titleComponent === 'number'
        ? titleComponent : title;

    return (
        <View style={[styles.container, style]}>
            {backVisible ? (
                <View
                    style={centered ? styles.side : undefined}
                    onLayout={centered ? event => setLeftWidth(event.nativeEvent.layout.width) : undefined}
                >
                    <View style={styles.left}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={backAccessibilityLabel}
                            accessibilityHint={backAccessibilityHint}
                            accessibilityState={{ disabled: backDisabled }}
                            activeOpacity={0.7}
                            disabled={backDisabled}
                            hitSlop={styles.hitSlop}
                            onPress={onBackPress}
                            style={styles.backButton}
                        >
                            {backIcon}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}

            <View
                style={[
                    styles.content,
                    customTitleIsNode && styles.customTitleContent,
                    customTitleIsNode && centered && styles.centeredCustomTitleContent,
                    availableCentered && styles.availableContent,
                    centered && leftWidth !== undefined && rightWidth !== undefined && {
                        marginLeft: leftGuard,
                        marginRight: rightGuard,
                    },
                    centered && leftWidth !== undefined && rightWidth !== undefined ? null : centered ? { opacity: 0 } : null,
                    contentStyle,
                ]}
            >
                {customTitleIsNode ? titleComponent : titleText != null ? (
                    <Typography
                        text={titleText}
                        variant={titleVariant}
                        size={titleSize}
                        numberOfLines={titleNumberOfLines}
                        style={[styles.title, centered && styles.centeredText, availableCentered && styles.availableText]}
                    />
                ) : null}
                {subtitle ? (
                    <Typography
                        text={subtitle}
                        variant={subtitleVariant}
                        size={subtitleSize}
                        numberOfLines={subtitleNumberOfLines}
                        style={[styles.subtitle, centered && styles.centeredText, availableCentered && styles.availableText]}
                    />
                ) : null}
            </View>

            <View
                style={centered ? styles.side : undefined}
                onLayout={centered ? event => setRightWidth(event.nativeEvent.layout.width) : undefined}
            >
                <View
                    style={rightAccessory ? styles.right : undefined}
                >
                    {rightAccessory}
                </View>
            </View>
        </View>
    );
};
