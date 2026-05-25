import { StyleSheet } from "react-native";
import { scaleFontSize, scaleHorizontal, scaleVertical } from "../../utils";
import { UIKitColors } from "../../theme";

export const getStyles = (colors: UIKitColors, isFocused: boolean) => (
    StyleSheet.create({
        container: {
            marginBottom: scaleVertical(8),
        },
        labelContainer: {
            flexDirection: 'row',
            marginBottom: scaleVertical(4),
        },
        label: {
            color: colors.text,
        },
        inputContainer: {
            minHeight: scaleVertical(44),
            paddingVertical: 0,
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(12),
            borderWidth: 1,
            borderColor: isFocused ? colors.border : colors.card,
            backgroundColor: colors.card,
            borderRadius: 8,
            flexDirection: 'row',
        },
        input: {
            flex: 1,
            minHeight: scaleVertical(44),
            fontFamily: 'Manrope-Medium',
            fontSize: scaleFontSize(14),
            includeFontPadding: false,
            paddingVertical: 0,
            color: colors.text,
        },
        inputMultiline:{
            textAlignVertical: 'top',
            paddingVertical: scaleVertical(8),
        },
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            height: scaleVertical(36),
            width: scaleHorizontal(36),
        },
        inputError: {
            borderColor: colors.error,
        },
        errorText: {
            color: colors.error,
            marginTop: 4,
        },
    }));
