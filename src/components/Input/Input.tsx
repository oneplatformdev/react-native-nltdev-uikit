import { memo, useMemo, forwardRef } from 'react';
import { TextInput, View, Text, ViewStyle, TextInputProps, TextStyle } from 'react-native';
import { getStyles } from './styles';
import { useNLTInput } from './useNLTInput';
import { useUIKitTheme } from '../../theme';

export interface NLTInputProps extends TextInputProps {
    RightAccessory?: React.ReactNode;
    LeftAccessory?: React.ReactNode;
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    isMandatory?: boolean;
    labelStyle?: TextStyle;
}

export const NLTInput = memo(forwardRef<TextInput, NLTInputProps>((
    { label, error, RightAccessory, LeftAccessory, containerStyle, secureTextEntry, inputContainerStyle, isMandatory, labelStyle, ...props },
    ref,
) => {
    const { colors } = useUIKitTheme();
    const { isFocused, isPasswordVisible, setPasswordVisible, handleFocus, handleBlur, inputRef } =
        useNLTInput({ secureTextEntry, ...props }, ref);
    const styles = useMemo(() => getStyles(colors, isFocused), [colors, isFocused]);

    return (
        <View style={[styles.container, containerStyle]}>
            {!!label && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, labelStyle]} >{label}</Text>
                    {isMandatory && (
                        <Text style={[styles.label, labelStyle]} >*</Text>
                    )}
                </View>
            )}
            <View style={[styles.inputContainer, inputContainerStyle, error && styles.inputError]}>
                {LeftAccessory}
                <TextInput
                    ref={inputRef}
                    {...props}
                    style={[styles.input, props.multiline && styles.inputMultiline, props.style]}
                    placeholderTextColor={colors.text_light + 'CC'}
                    secureTextEntry={secureTextEntry && isPasswordVisible}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {RightAccessory}
                {/* {typeof secureTextEntry === 'boolean' && (
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                        hitSlop={10}
                    >
                        {isPasswordVisible ? (
                            <Eye color={colors.icon_strong} pointerEvents="none" />
                        ) : (
                            <EyeOff color={colors.icon_strong} pointerEvents="none" />
                        )}
                    </TouchableOpacity>
                )} */}
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
},
),
);

NLTInput.displayName = 'NLTInput';
