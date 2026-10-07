import { StyleSheet } from 'react-native';
import type { UIColors, UIRadius, UISpacing } from '../../theme';
import type { ScalingFunctions } from '../../utils';

export const getStyles = (colors: UIColors, spacing: UISpacing, radius: UIRadius, scaling: ScalingFunctions) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.text,
        },
        backdropTouch: {
            ...StyleSheet.absoluteFill,
        },
        alertContainer: {
            width: '90%',
            maxHeight: '85%',
            backgroundColor: colors.background,
            borderRadius: scaling.scaleHorizontal(radius.lg),
            borderWidth: scaling.scaleHorizontal(1),
            borderColor: colors.border,
            overflow: 'hidden',
        },
        handle: {
            width: scaling.scaleHorizontal(56),
            height: scaling.scaleVertical(5),
            borderRadius: scaling.scaleHorizontal(radius.full),
            backgroundColor: colors.border,
            alignSelf: 'center',
            marginTop: scaling.scaleVertical(spacing.md),
        },
        header: {
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingVertical: scaling.scaleVertical(spacing.md),
        },
        headerRow: {
            minHeight: scaling.scaleVertical(28),
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerText: {
            paddingHorizontal: scaling.scaleHorizontal(36),
            textAlign: 'center',
        },
        closeButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            padding: scaling.scaleHorizontal(spacing.xs),
        },
        content: {
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
        },
        footer: {
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingTop: scaling.scaleVertical(spacing.md),
            paddingBottom: scaling.scaleVertical(spacing.xl),
        },
    });

    return styles;
};
