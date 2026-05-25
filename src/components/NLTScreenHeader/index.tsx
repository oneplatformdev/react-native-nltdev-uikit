import React, { FC, useCallback, useMemo } from 'react';
import { Text, View, TouchableOpacity, Keyboard, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStyle } from './styles';
import { ArrowIcon } from './ArrowIcon';
import { useUIKitTheme } from '../../theme';

interface IProps {
    title?: string;
    onPressBack?: () => void;
    backDisabled?: boolean;
    rightComponent?: React.ReactNode;
    containerStyle?: ViewStyle;
    titleStyle?: TextStyle;
}

export const NLTScreenHeader: FC<IProps> = ({ title, backDisabled, rightComponent, containerStyle, onPressBack, titleStyle }) => {
    const { colors } = useUIKitTheme();
    const styles = useMemo(() => getStyle(colors, backDisabled), [colors, backDisabled]);
    const navigation = useNavigation<any>();

    const onGoBack = useCallback(() => {
        Keyboard.dismiss();
        if (onPressBack) {
            onPressBack();
        } else {
            navigation.canGoBack() && navigation.goBack();
        }
    }, [onPressBack, navigation]);

    return (
        <View style={[styles.container, containerStyle]}>
            {backDisabled ? null
                : <TouchableOpacity style={styles.button} onPress={onGoBack}>
                    <ArrowIcon color={colors.icon} />
                </TouchableOpacity>}
            <View style={[styles.titleContainer]}>
                <Text style={[styles.title, titleStyle]} numberOfLines={1}>
                    {title}
                </Text>
            </View>
            {rightComponent}
        </View>
    );
};
