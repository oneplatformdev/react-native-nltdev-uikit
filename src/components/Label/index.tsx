import React, { FC, useMemo } from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { getStyles } from './styles';
import { useUIKitTheme } from '../..';

interface IProps {
    label: string;
    color: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    onPress?: () => void;
}


export const NLTLabel: FC<IProps> = ({ label, color, containerStyle, textStyle, onPress }) => {
    const { colors } = useUIKitTheme();
    const styles = useMemo(() => getStyles(colors, color), [colors, color]);

    return (
        <TouchableOpacity style={[styles.container, containerStyle]} disabled={!onPress} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};
