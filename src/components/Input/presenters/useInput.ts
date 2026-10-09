import { useCallback, useEffect, useState } from 'react';
import type { TextInputProps } from 'react-native';
import { useUITheme } from '../../../theme';
import type { InputProps } from '../types/types';

type UseInputProps = Pick<
    InputProps,
    | 'accessibilityHint'
    | 'accessibilityLabel'
    | 'accessibilityState'
    | 'disabled'
    | 'editable'
    | 'errorText'
    | 'errorTextProps'
    | 'helperText'
    | 'helperTextProps'
    | 'invalid'
    | 'label'
    | 'labelProps'
    | 'onBlur'
    | 'onFocus'
    | 'passwordToggle'
    | 'placeholderTextColor'
    | 'secureTextEntry'
>;

export const useInput = ({
    accessibilityHint,
    accessibilityLabel,
    accessibilityState,
    disabled = false,
    editable,
    errorText,
    errorTextProps,
    helperText,
    helperTextProps,
    invalid = false,
    label,
    labelProps,
    onBlur,
    onFocus,
    passwordToggle,
    placeholderTextColor,
    secureTextEntry,
}: UseInputProps) => {
    const { colors, input } = useUITheme();
    const canTogglePassword = Boolean(secureTextEntry && passwordToggle);
    const [visibility, setVisibility] = useState({ enabled: canTogglePassword, visible: false });
    const [isFocused, setFocused] = useState(false);

    useEffect(() => {
        setVisibility(current => current.enabled === canTogglePassword
            ? current
            : { enabled: canTogglePassword, visible: false });
    }, [canTogglePassword]);

    const isPasswordVisible = canTogglePassword && visibility.enabled === canTogglePassword && visibility.visible;
    const isInvalid = invalid || Boolean(errorText);

    const onInputFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
        event => {
            setFocused(true);
            onFocus?.(event);
        },
        [onFocus],
    );
    const onInputBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
        event => {
            setFocused(false);
            onBlur?.(event);
        },
        [onBlur],
    );
    const onPasswordVisibilityToggle = useCallback(() => {
        setVisibility(current => ({
            enabled: canTogglePassword,
            visible: !(current.enabled === canTogglePassword && current.visible),
        }));
    }, [canTogglePassword]);
    const passwordAction = isPasswordVisible ? passwordToggle?.hide : passwordToggle?.show;

    return {
        canTogglePassword,
        errorColor: errorTextProps?.color ?? input.colors.error,
        errorVariant: errorTextProps?.variant ?? input.typography.errorVariant,
        helperColor: helperTextProps?.color ?? input.colors.helper,
        helperVariant: helperTextProps?.variant ?? input.typography.helperVariant,
        labelColor: labelProps?.color ?? input.colors.label,
        labelVariant: labelProps?.variant ?? input.typography.labelVariant,
        isFocused,
        isInvalid,
        onInputBlur,
        onInputFocus,
        onPasswordVisibilityToggle,
        passwordAction,
        resolvedAccessibilityHint: accessibilityHint ?? (errorText || undefined),
        resolvedAccessibilityLabel: accessibilityLabel ?? label,
        resolvedAccessibilityState: disabled ? { ...accessibilityState, disabled: true } : accessibilityState,
        resolvedEditable: disabled ? false : editable,
        resolvedPlaceholderTextColor: placeholderTextColor ?? colors[input.colors.placeholder],
        resolvedSecureTextEntry: secureTextEntry ? !isPasswordVisible : secureTextEntry,
        showHelperText: !isInvalid && Boolean(helperText),
    };
};
