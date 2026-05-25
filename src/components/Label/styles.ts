
import { StyleSheet } from 'react-native';
import { UIKitColors } from '../../theme';
import { scaleVertical, scaleHorizontal, scaleFontSize } from '../../utils';

export const getStyles = (colors: UIKitColors, color: string) => {
    const styles = StyleSheet.create({
        card: {
            borderRadius: scaleVertical(999),
            paddingHorizontal: scaleHorizontal(10),
            paddingVertical: scaleVertical(6),
            backgroundColor: color,
        },
        text: {
            color: colors.text_inverted,
            fontSize: scaleFontSize(12),
            fontWeight: '600',
            lineHeight: scaleVertical(16),
        },
    });

    return styles;
};
