import { StyleSheet } from 'react-native';
import type { UIColors, UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';

export const getStyles = (colors: UIColors, spacing: UISpacing, scaling: ScalingFunctions) => {
    const backSize = scaling.scaleVertical(18);
    const sideGap = scaling.scaleHorizontal(spacing.md);

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingVertical: scaling.scaleVertical(spacing.xs),
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
            top: scaling.scaleVertical(spacing.sm),
            bottom: scaling.scaleVertical(spacing.sm),
            left: scaling.scaleHorizontal(spacing.sm),
            right: scaling.scaleHorizontal(spacing.sm),
        },
        content: {
            flex: 1,
            minWidth: 0,
            justifyContent: 'center',
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
