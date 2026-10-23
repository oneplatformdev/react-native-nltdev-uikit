import { StyleSheet } from 'react-native';
import type { UIColors } from '../../../theme';
import type { UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';

export const getStyles = (colors: UIColors) => {
    const styles = StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: colors.background,
        },
        layer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        safeArea: {
            flex: 1,
            backgroundColor: colors.transparent,
        },
        container: {
            flex: 1,
            backgroundColor: colors.transparent,
        },
        content: {
            flexGrow: 1,
        },
    });

    return styles;
};

export const getBottomOffset = (spacing: UISpacing, scaling: ScalingFunctions) => scaling.scaleVertical(spacing.xl);
