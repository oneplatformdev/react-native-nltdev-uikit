import { StyleSheet } from 'react-native';
import type { UIColors, UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';

export const getStyles = (colors: UIColors, spacing: UISpacing, scaling: ScalingFunctions, backButtonSize = 18) => {
    const designBackSize = Number.isFinite(backButtonSize) && backButtonSize > 0 ? backButtonSize : 18;
    const backSize = scaling.scaleVertical(designBackSize);
    const sideGap = scaling.scaleHorizontal(spacing.md);
    const hitSlop = Math.max(0, (18 + 2 * spacing.sm - designBackSize) / 2);

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingVertical: scaling.scaleVertical(spacing.xs),
        },
        side: {
            flexShrink: 0,
        },
        left: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            minWidth: backSize + sideGap,
            paddingRight: sideGap,
        },
        backButton: {
            width: backSize,
            height: backSize,
            alignItems: 'center',
            justifyContent: 'center',
        },
        hitSlop: {
            top: scaling.scaleVertical(hitSlop),
            bottom: scaling.scaleVertical(hitSlop),
            left: scaling.scaleHorizontal(hitSlop),
            right: scaling.scaleHorizontal(hitSlop),
        },
        content: {
            flex: 1,
            minWidth: 0,
            justifyContent: 'center',
        },
        customTitleContent: {
            overflow: 'hidden',
        },
        centeredCustomTitleContent: {
            alignItems: 'center',
        },
        availableContent: {
            alignItems: 'center',
            overflow: 'hidden',
        },
        availableText: {
            alignSelf: 'stretch',
            textAlign: 'center',
        },
        centeredText: {
            textAlign: 'center',
        },
        title: {
            color: colors.text,
        },
        subtitle: {
            color: colors.textMuted,
        },
        right: {
            minWidth: scaling.scaleVertical(34) + sideGap,
            minHeight: scaling.scaleVertical(34),
            alignSelf: 'flex-end',
            paddingLeft: sideGap,
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
    });
};
