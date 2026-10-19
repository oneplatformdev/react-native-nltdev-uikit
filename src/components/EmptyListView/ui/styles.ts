import { StyleSheet } from 'react-native';
import type { UISpacing } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';

export const getStyles = (spacing: UISpacing, scaling: ScalingFunctions) => {
    const styles = StyleSheet.create({
        container: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingVertical: scaling.scaleVertical(spacing.xl),
        },
        content: {
            width: '100%',
            alignItems: 'center',
            gap: scaling.scaleVertical(spacing.md),
        },
        visual: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            textAlign: 'center',
        },
        description: {
            textAlign: 'center',
        },
    });

    return styles;
};
