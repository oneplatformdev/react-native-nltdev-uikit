import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUITheme } from '../../theme';
import { useScaling } from '../../utils';
import { Typography } from '../Typography';
import { getStyles } from './styles';
import type { HeaderWithBackButtonProps } from './types';

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
    const [leftWidth, setLeftWidth] = useState<number>();
    const [rightWidth, setRightWidth] = useState<number>();
    const centered = titleAlign === 'center';
    const sideWidth = Math.max(leftWidth ?? 0, rightWidth ?? 0);

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
