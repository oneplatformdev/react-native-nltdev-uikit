import { FC, useMemo } from "react";
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native";
import { getStyles } from "./styles";
import { useUIKitTheme } from '../../theme/ThemeProvider';

interface IProps extends TouchableOpacityProps {
    containerStyle?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle;
    text: string;
    type?: 'main' | 'secondary';
    RightAccessory?: React.ReactNode;
    LeftAccessory?: React.ReactNode;
    inProgress?: boolean;
};

export const NLTButton: FC<IProps> = ({ text, type = 'main', disabled, RightAccessory, LeftAccessory, containerStyle, textStyle, inProgress, ...props }) => {
    const { colors } = useUIKitTheme();
    const styles = useMemo(() => getStyles(colors, type, disabled), [colors, disabled, type]);

    return (
        <TouchableOpacity {...props} disabled={inProgress || disabled} style={[styles.container, containerStyle]}>
            {inProgress ? (
                <View style={styles.absoluteSheet}>
                    <ActivityIndicator color={colors.background} size="small" />
                </View>
            ) : (
                <>
                    {LeftAccessory}
                    <Text style={[styles.text, textStyle]}>{text}</Text>
                    {RightAccessory}
                </>
            )}
        </TouchableOpacity>
    );
};