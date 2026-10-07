import { StyleSheet } from 'react-native';
import type { UIColors, UISpacing } from '../../theme';
import type { ScalingFunctions } from '../../utils';

export const getStyles = (colors: UIColors, spacing: UISpacing, scaling: ScalingFunctions) => {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
        },
        reconnected: {
            backgroundColor: colors.success,
        },
        disconnected: {
            backgroundColor: colors.error,
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaling.scaleHorizontal(spacing.sm),
            paddingVertical: scaling.scaleVertical(spacing.md),
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
        },
        text: {
            flexShrink: 1,
            color: colors.onPrimary,
        },
    });

    return styles;
};
