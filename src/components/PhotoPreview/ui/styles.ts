import { StyleSheet } from 'react-native';
import type { UIColors, UIRadius, UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';
import type { PhotoPreviewProps } from '../types/types';

const positiveOrUndefined = (value: number | undefined) =>
    value !== undefined && Number.isFinite(value) && value > 0 ? value : undefined;

export const getStyles = (
    colors: UIColors,
    radius: UIRadius,
    spacing: UISpacing,
    scaling: ScalingFunctions,
    width: PhotoPreviewProps['width'],
    height: PhotoPreviewProps['height'],
    aspectRatio: PhotoPreviewProps['aspectRatio'],
    borderRadius: PhotoPreviewProps['borderRadius'],
) => {
    const designWidth = positiveOrUndefined(width);
    const designHeight = positiveOrUndefined(height);
    const ratio = positiveOrUndefined(aspectRatio);
    const useWidth = designWidth !== undefined || designHeight === undefined;
    const derivedRatio = ratio ?? (designWidth === undefined || designHeight === undefined ? 1 : undefined);
    const containerWidth = useWidth ? scaling.scaleHorizontal(designWidth ?? 120) : undefined;
    const containerHeight = derivedRatio === undefined || !useWidth
        ? designHeight === undefined ? undefined : scaling.scaleVertical(designHeight)
        : undefined;
    const designRadius = borderRadius !== undefined && Number.isFinite(borderRadius)
        ? Math.max(0, borderRadius) : radius.md;

    const styles = StyleSheet.create({
        container: {
            width: containerWidth,
            height: containerHeight,
            aspectRatio: derivedRatio,
            borderRadius: scaling.scaleHorizontal(designRadius),
            backgroundColor: colors.surface,
            overflow: 'hidden',
        },
        image: {
            ...StyleSheet.absoluteFill,
        },
        overlay: {
            ...StyleSheet.absoluteFill,
        },
        remove: {
            position: 'absolute',
            top: scaling.scaleVertical(spacing.sm),
            right: scaling.scaleHorizontal(spacing.sm),
            zIndex: 1,
            width: scaling.scaleHorizontal(28),
            height: scaling.scaleHorizontal(28),
            borderRadius: scaling.scaleHorizontal(14),
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
        },
        removeText: {
            color: colors.text,
            fontSize: scaling.scaleFontSize(22),
            lineHeight: scaling.scaleLineHeight(24),
            textAlign: 'center',
        },
    });
    const removeHitSlop = scaling.scaleHorizontal(8);

    return { styles, removeHitSlop };
};
