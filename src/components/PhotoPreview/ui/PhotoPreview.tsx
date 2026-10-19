import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { getStyles } from './styles';
import type { PhotoPreviewProps } from '../types/types';

export const PhotoPreview = ({
    source,
    width,
    height,
    aspectRatio,
    borderRadius,
    resizeMode = 'cover',
    overlay,
    removeIcon,
    onRemovePress,
    removeAccessibilityLabel,
    removeAccessibilityHint,
    onPress,
    accessibilityLabel,
    accessibilityHint,
    disabled = false,
    style,
    imageStyle,
}: PhotoPreviewProps) => {
    const { colors, radius, spacing } = useUITheme();
    const scaling = useScaling();
    const { styles, removeHitSlop } = useMemo(
        () => getStyles(colors, radius, spacing, scaling, width, height, aspectRatio, borderRadius),
        [colors, radius, spacing, scaling, width, height, aspectRatio, borderRadius],
    );
    const image = (
        <Image
            source={source}
            resizeMode={resizeMode}
            accessible={!onPress}
            accessibilityRole={onPress ? undefined : 'image'}
            accessibilityLabel={onPress ? undefined : accessibilityLabel}
            accessibilityHint={onPress ? undefined : accessibilityHint}
            style={[styles.image, imageStyle]}
        />
    );

    return (
        <View style={[styles.container, style]}>
            {onPress ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={accessibilityLabel}
                    accessibilityHint={accessibilityHint}
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    onPress={onPress}
                    style={StyleSheet.absoluteFill}
                >
                    {image}
                </Pressable>
            ) : image}
            {overlay != null && overlay !== false ? (
                <View pointerEvents={disabled ? 'none' : 'box-none'} style={styles.overlay}>
                    {typeof overlay === 'string' || typeof overlay === 'number' ? <Text>{overlay}</Text> : overlay}
                </View>
            ) : null}
            {onRemovePress ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={removeAccessibilityLabel ?? 'Remove photo'}
                    accessibilityHint={removeAccessibilityHint}
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    hitSlop={removeHitSlop}
                    onPress={onRemovePress}
                    style={styles.remove}
                >
                    {removeIcon === undefined ? <Text style={styles.removeText}>×</Text>
                        : typeof removeIcon === 'string' || typeof removeIcon === 'number'
                            ? <Text style={styles.removeText}>{removeIcon}</Text> : removeIcon}
                </Pressable>
            ) : null}
        </View>
    );
};
