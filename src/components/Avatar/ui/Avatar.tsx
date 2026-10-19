import { useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Typography } from '../../Typography';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { useAvatar } from '../presenters/useAvatar';
import { getStyles } from './styles';
import type { AvatarProps } from '../types/types';

export const Avatar = ({
    source,
    name,
    fallbackText,
    fallback,
    size = 40,
    shape = 'circle',
    borderRadius,
    backgroundColor,
    textColor,
    imageStyle,
    style,
    badge,
    onPress,
    disabled = false,
    accessibilityLabel,
    accessibilityHint,
    imageAccessibilityLabel,
}: AvatarProps) => {
    const { colors, radius } = useUITheme();
    const scaling = useScaling();
    const { styles, hitSlop, textSize, textLineHeight } = useMemo(
        () => getStyles(colors, radius, scaling, size, shape, borderRadius, backgroundColor, textColor),
        [colors, radius, scaling, size, shape, borderRadius, backgroundColor, textColor],
    );
    const { showImage, onImageError, initials } = useAvatar(source, name);
    const text = fallbackText?.trim() || initials;
    const fallbackLabel = name?.trim() || fallbackText?.trim() || 'Avatar';
    const label = onPress
        ? accessibilityLabel ?? fallbackLabel
        : imageAccessibilityLabel ?? accessibilityLabel ?? fallbackLabel;
    const content = showImage ? (
        <Image source={source} onError={onImageError} accessible={false} style={[imageStyle, styles.image]} />
    ) : fallback != null && typeof fallback !== 'boolean' ? (
        typeof fallback === 'string' || typeof fallback === 'number'
            ? <Typography text={fallback} size={textSize} lineHeight={textLineHeight} style={styles.text} accessible={false} />
            : fallback
    ) : text ? (
        <Typography text={text} size={textSize} lineHeight={textLineHeight} style={styles.text} accessible={false} numberOfLines={1} />
    ) : (
        <View style={styles.generic} accessible={false}>
            <View style={styles.genericHead} />
            <View style={styles.genericShoulders} />
        </View>
    );

    return (
        <View style={[style, styles.wrapper]}>
            {onPress ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityHint={accessibilityHint}
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    hitSlop={hitSlop}
                    onPress={onPress}
                    style={styles.surface}
                >
                    {content}
                </Pressable>
            ) : (
                <View accessible accessibilityRole="image" accessibilityLabel={label} style={styles.surface}>
                    {content}
                </View>
            )}
            {badge != null && typeof badge !== 'boolean' ? (
                <View pointerEvents="box-none" style={styles.badge}>
                    {typeof badge === 'string' || typeof badge === 'number'
                        ? <Typography text={badge} variant="caption" /> : badge}
                </View>
            ) : null}
        </View>
    );
};
