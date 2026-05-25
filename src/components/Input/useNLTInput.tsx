import { useImperativeHandle, useRef, useState } from 'react';
import { type TextInput, type TextInputProps } from 'react-native';

interface IProps extends TextInputProps {
    secureTextEntry?: boolean;
}

export const useNLTInput = (props: IProps, ref: React.Ref<TextInput>) => {
    const { secureTextEntry = false, onFocus, onBlur } = props;
    const [isFocused, setFocused] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(secureTextEntry);
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const handleFocus: TextInputProps['onFocus'] = e => {
        setFocused(true);
        onFocus?.(e);
    };

    const handleBlur: TextInputProps['onBlur'] = e => {
        setFocused(false);
        onBlur?.(e);
    };

    return { isFocused, isPasswordVisible, setPasswordVisible, handleFocus, handleBlur, inputRef };
};
