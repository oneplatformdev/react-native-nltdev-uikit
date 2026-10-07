import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TextInputProps } from 'react-native';
import { useUITheme } from '../../theme';
import { useScaling } from '../../utils';
import { getStyles } from './styles';
import type { InputProps } from './types';

type InputPresenterProps = Pick<
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
    | 'multiline'
    | 'onBlur'
    | 'onFocus'
    | 'passwordToggle'
    | 'placeholderTextColor'
    | 'secureTextEntry'
    | 'style'
>;

export const useInputPresenter = ({
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
    multiline,
    onBlur,
    onFocus,
    passwordToggle,
    placeholderTextColor,
    secureTextEntry,
    style,
}: InputPresenterProps) => {
    const { colors, fonts, input } = useUITheme();
    const scaling = useScaling();
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
    const styles = useMemo(
        () => getStyles(colors, fonts, input, scaling, isFocused, isInvalid, disabled),
        [colors, disabled, fonts, input, isFocused, isInvalid, scaling],
    );

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
        onInputBlur,
        onInputFocus,
        onPasswordVisibilityToggle,
        passwordAction,
        passwordHitSlop: canTogglePassword && passwordAction ? scaling.scaleHorizontal(12) : undefined,
        resolvedAccessibilityHint: accessibilityHint ?? (errorText || undefined),
        resolvedAccessibilityLabel: accessibilityLabel ?? label,
        resolvedAccessibilityState: disabled ? { ...accessibilityState, disabled: true } : accessibilityState,
        resolvedEditable: disabled ? false : editable,
        resolvedPlaceholderTextColor: placeholderTextColor ?? colors[input.colors.placeholder],
        resolvedSecureTextEntry: secureTextEntry ? !isPasswordVisible : secureTextEntry,
        showHelperText: !isInvalid && Boolean(helperText),
        styles,
        textInputStyle: [styles.text, multiline && styles.multilineText, style],
    };
};
