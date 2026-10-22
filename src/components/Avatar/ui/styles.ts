import { StyleSheet } from 'react-native';
import type { UIColors, UIRadius } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';
import type { AvatarProps } from '../types/types';

export const getStyles = (
    colors: UIColors,
    radius: UIRadius,
    scaling: ScalingFunctions,
    size: number,
    shape: AvatarProps['shape'],
    borderRadius: AvatarProps['borderRadius'],
    backgroundColor: AvatarProps['backgroundColor'],
    textColor: AvatarProps['textColor'],
) => {
    const designSize = Number.isFinite(size) && size > 0 ? size : 40;
    const scaledSize = scaling.scaleHorizontal(designSize);
    const designRadius = borderRadius !== undefined && Number.isFinite(borderRadius)
        ? Math.max(0, borderRadius) : radius.sm;
    const foreground = textColor ?? colors.textMuted;

    const styles = StyleSheet.create({
        wrapper: {
            width: scaledSize,
            height: scaledSize,
            overflow: 'visible',
        },
        surface: {
            width: scaledSize,
            height: scaledSize,
            borderRadius: shape === 'square' ? scaling.scaleHorizontal(designRadius) : scaledSize / 2,
            overflow: 'hidden',
            backgroundColor: backgroundColor ?? colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        text: {
            color: foreground,
            textAlign: 'center',
            maxWidth: '100%',
        },
        generic: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        genericHead: {
            width: scaledSize * 0.23,
            height: scaledSize * 0.23,
            borderRadius: scaledSize * 0.115,
            backgroundColor: foreground,
        },
        genericShoulders: {
            width: scaledSize * 0.48,
            height: scaledSize * 0.22,
            marginTop: scaledSize * 0.04,
            borderTopLeftRadius: scaledSize * 0.24,
            borderTopRightRadius: scaledSize * 0.24,
            backgroundColor: foreground,
        },
        badge: {
            position: 'absolute',
            right: -scaledSize * 0.08,
            bottom: -scaledSize * 0.08,
        },
    });
    const hitSlop = scaling.scaleHorizontal(Math.max(8, (44 - designSize) / 2));

    return { styles, hitSlop, textSize: designSize * 0.34, textLineHeight: designSize * 0.42 };
};
