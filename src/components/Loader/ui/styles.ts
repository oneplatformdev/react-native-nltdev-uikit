import { StyleSheet } from 'react-native';
import type { UIColors } from '../../../theme';

export const getStyles = (colors: UIColors, inline: boolean, transparent: boolean) => StyleSheet.create({
    container: {
        zIndex: 5,
        position: inline ? 'relative' : 'absolute',
        width: '100%',
        height: inline ? undefined : '100%',
        backgroundColor: transparent ? colors.transparent : colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
