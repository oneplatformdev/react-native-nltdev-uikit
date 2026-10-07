import { StyleSheet } from 'react-native';
import type { UIColors, UIRadius, UISpacing } from '../../theme';
import type { ScalingFunctions } from '../../utils';

export const getStyles = (
    colors: UIColors,
    spacing: UISpacing,
    radius: UIRadius,
    scaling: ScalingFunctions,
    bottomInset: number,
) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.text,
        },
        keyboardBackground: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: scaling.scaleHorizontal(radius.lg),
            borderTopRightRadius: scaling.scaleHorizontal(radius.lg),
            overflow: 'hidden',
            flexShrink: 1,
        },
        container: {
            overflow: 'hidden',
            flexShrink: 1,
        },
        fullScreenContainer: {
            flex: 1,
            minHeight: 0,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingTop: scaling.scaleVertical(spacing.lg),
            position: 'relative',
        },
        titleContainer: {
            flex: 1,
            flexShrink: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: scaling.scaleVertical(spacing.sm),
        },
        closeButton: {
            width: scaling.scaleHorizontal(40),
            height: scaling.scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            textAlign: 'center',
            color: colors.text,
        },
        contentContainer: {
            paddingHorizontal: scaling.scaleHorizontal(spacing.lg),
            paddingBottom: bottomInset + scaling.scaleVertical(spacing.lg),
            flexShrink: 1,
        },
        fullScreenContentContainer: {
            flex: 1,
            minHeight: 0,
        },
    });

    return styles;
};
