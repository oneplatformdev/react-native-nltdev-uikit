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
    subtitle,
    onBackPress,
    backIcon,
    backAccessibilityLabel,
    backAccessibilityHint,
    backDisabled = false,
    rightAccessory,
    titleAlign = 'left',
    titleVariant = 'h3',
    titleSize,
    subtitleVariant = 'caption',
    subtitleSize,
    style,
    contentStyle,
}: HeaderWithBackButtonProps) => {
    const { colors, spacing } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(() => getStyles(colors, spacing, scaling), [colors, spacing, scaling]);
    const { leftWidth, rightWidth, setLeftWidth, setRightWidth, centered, sideWidth } = useHeaderWithBackButton(titleAlign);

    return (
        <View style={[styles.container, style]}>
            <View style={centered ? { width: sideWidth } : undefined}>
                <View
                    style={styles.left}
                    onLayout={centered ? event => setLeftWidth(event.nativeEvent.layout.width) : undefined}
                >
                    {!backDisabled && (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={backAccessibilityLabel}
                            accessibilityHint={backAccessibilityHint}
                            activeOpacity={0.7}
                            hitSlop={styles.hitSlop}
                            onPress={onBackPress}
                            style={styles.backButton}
                        >
                            {backIcon}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View
                style={[
                    styles.content,
                    centered && leftWidth !== undefined && rightWidth !== undefined ? null : centered ? { opacity: 0 } : null,
                    contentStyle,
                ]}
            >
                <Typography
                    text={title}
                    variant={titleVariant}
                    size={titleSize}
                    numberOfLines={1}
                    style={[styles.title, centered && styles.centeredText]}
                />
                {subtitle ? (
                    <Typography
                        text={subtitle}
                        variant={subtitleVariant}
                        size={subtitleSize}
                        numberOfLines={1}
                        style={[styles.subtitle, centered && styles.centeredText]}
                    />
                ) : null}
            </View>

            <View style={centered ? { width: sideWidth } : undefined}>
                <View
                    style={rightAccessory ? styles.right : undefined}
                    onLayout={centered ? event => setRightWidth(event.nativeEvent.layout.width) : undefined}
                >
                    {rightAccessory}
                </View>
            </View>
        </View>
    );
};
