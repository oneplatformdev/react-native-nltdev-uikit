import { StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { UIColors, UIButtonSizeTheme, UIButtonVariantTheme } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';
import type { ButtonProps } from '../types/types';

export const getStyles = (
    colors: UIColors,
    scaling: ScalingFunctions,
    variant: UIButtonVariantTheme,
    size: UIButtonSizeTheme,
) => {
    const container: ViewStyle = {
        minHeight: scaling.scaleVertical(size.minHeight),
        paddingHorizontal: scaling.scaleHorizontal(size.paddingHorizontal),
        paddingVertical: scaling.scaleVertical(size.paddingVertical),
        borderRadius: scaling.scaleHorizontal(size.radius),
        borderWidth: scaling.scaleHorizontal(variant.borderWidth ?? size.borderWidth),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors[variant.background],
        borderColor: colors[variant.border],
    };

    const text: TextStyle = {
        flexShrink: 1,
        minWidth: 0,
        textAlign: 'center',
    };

    const styles = StyleSheet.create({
        container,
        content: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaling.scaleHorizontal(size.gap),
        },
        disabled: {
            backgroundColor: colors[variant.disabledBackground],
            borderColor: colors[variant.disabledBorder],
        },
        fullWidth: {
            width: '100%',
        },
        hidden: {
            opacity: 0,
        },
        icon: {
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        loader: {
            ...StyleSheet.absoluteFill,
            alignItems: 'center',
            justifyContent: 'center',
        },
        pressed: {
            opacity: 0.82,
        },
        text,
    });

    return styles;
};

export const resolveButtonStyle = (
    styles: ReturnType<typeof getStyles>,
    pressed: boolean,
    style: ButtonProps['style'],
    interactionDisabled: boolean,
    visuallyDisabled: boolean,
    fullWidth: boolean,
): StyleProp<ViewStyle> => [
    styles.container,
    pressed && !interactionDisabled && styles.pressed,
    visuallyDisabled && styles.disabled,
    fullWidth && styles.fullWidth,
    typeof style === 'function' ? style({ pressed }) : style,
];
