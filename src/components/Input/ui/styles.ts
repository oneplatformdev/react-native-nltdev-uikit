import { StyleSheet } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { UIColors, UIFonts, UIInputTheme } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';

export const getStyles = (
    colors: UIColors,
    fonts: UIFonts,
    input: UIInputTheme,
    scaling: ScalingFunctions,
    focused: boolean,
    invalid: boolean,
    disabled: boolean,
) => {
    const { geometry, typography, colors: tokens } = input;
    const border = disabled
        ? tokens.disabledBorder
        : invalid
            ? tokens.errorBorder
            : focused
                ? tokens.focusedBorder
                : tokens.border;
    const field: ViewStyle = {
        minHeight: scaling.scaleVertical(geometry.minHeight),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaling.scaleHorizontal(geometry.paddingHorizontal),
        borderWidth: scaling.scaleHorizontal(geometry.borderWidth),
        borderColor: colors[border],
        borderRadius: scaling.scaleHorizontal(geometry.radius),
        backgroundColor: colors[disabled ? tokens.disabledBackground : tokens.background],
    };
    const text: TextStyle = {
        flex: 1,
        minWidth: 0,
        minHeight: scaling.scaleVertical(geometry.textMinHeight),
        paddingVertical: 0,
        ...fonts[typography.inputFont],
        fontSize: scaling.scaleFontSize(typography.inputFontSize),
        includeFontPadding: typography.includeFontPadding,
        color: colors[disabled ? tokens.disabledText : tokens.text],
    };

    const styles = StyleSheet.create({
        container: {
            marginBottom: scaling.scaleVertical(geometry.marginBottom),
        },
        labelContainer: {
            marginBottom: scaling.scaleVertical(geometry.labelGap),
        },
        field,
        text,
        multilineText: {
            textAlignVertical: 'top',
            paddingVertical: scaling.scaleVertical(geometry.multilinePaddingVertical),
        },
        startAccessory: {
            alignItems: 'center',
            justifyContent: 'center',
            marginEnd: scaling.scaleHorizontal(geometry.startAccessoryGap),
        },
        endAccessory: {
            alignItems: 'center',
            justifyContent: 'center',
            marginStart: scaling.scaleHorizontal(geometry.endAccessoryGap),
        },
        passwordToggle: {
            alignItems: 'center',
            justifyContent: 'center',
            marginStart: scaling.scaleHorizontal(geometry.passwordToggleGap),
        },
        supportingText: {
            marginTop: scaling.scaleVertical(geometry.supportingGap),
        },
    });

    return styles;
};

export const getPasswordHitSlop = (scaling: ScalingFunctions) => scaling.scaleHorizontal(12);
