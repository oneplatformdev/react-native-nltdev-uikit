import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { scaleHorizontal, scaleVertical } from '../../utils';
import { UIKitColors } from '../../theme/types';

export const getStyles = (colors: UIKitColors, type: 'main' | 'secondary', disabled?: boolean) => {
    const MAIN_CONTAINER: ViewStyle = {
        height: scaleVertical(44),
        flexDirection: 'row',
        gap: scaleHorizontal(8),
        borderWidth: 1,
        borderColor: disabled ? colors.inactiveButtonBackground : colors.activeButtonBackground,
        paddingHorizontal: scaleHorizontal(8),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled ? colors.inactiveButtonBackground : colors.activeButtonBackground,
        borderRadius: 16, 
    };
    const MAIN_TEXT: TextStyle = {
        textAlign: 'center',
        color: disabled ? colors.inactiveButtonText : colors.activeButtonText,
        fontSize: 16,
        fontWeight: '600',
    };
    const CONTAINERS = {
        main: MAIN_CONTAINER,
        secondary: {
            ...MAIN_CONTAINER,
            borderColor: disabled ? colors.inactiveButtonBackground : colors.activeButtonBackground,
            backgroundColor: 'transparent',
            shadowOpacity: 0,
            elevation: 0,
        },
    };
    const TEXT = {
        main: MAIN_TEXT,
        secondary: {
            ...MAIN_TEXT,
            color: disabled ? colors.inactiveButtonText : colors.activeButtonText,
        },
    };
    const styles = StyleSheet.create({
        container: CONTAINERS[type],
        text: TEXT[type],
        absoluteSheet: {
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
