import React, { forwardRef, memo, useMemo } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Typography } from '../../Typography';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { useInput } from '../presenters/useInput';
import type { InputProps, InputRef } from '../types/types';
import { getPasswordHitSlop, getStyles } from './styles';

const InputComponent = forwardRef<InputRef, InputProps>(
    (
        {
            accessibilityHint,
            accessibilityLabel,
            accessibilityState,
            containerStyle,
            disabled = false,
            editable,
            endAccessory,
            errorText,
            errorTextProps,
            helperText,
            helperTextProps,
            inputContainerStyle,
            invalid = false,
            label,
            labelProps,
            multiline,
            onBlur,
            onFocus,
            passwordToggle,
            placeholderTextColor,
            secureTextEntry,
            startAccessory,
            style,
            ...nativeProps
        },
        ref,
    ) => {
        const {
            canTogglePassword,
            errorColor,
            errorVariant,
            helperColor,
            helperVariant,
            isFocused,
            isInvalid,
            labelColor,
            labelVariant,
            onInputBlur,
            onInputFocus,
            onPasswordVisibilityToggle,
            passwordAction,
            resolvedAccessibilityHint,
            resolvedAccessibilityLabel,
            resolvedAccessibilityState,
            resolvedEditable,
            resolvedPlaceholderTextColor,
            resolvedSecureTextEntry,
            showHelperText,
        } = useInput({
            accessibilityHint,
            accessibilityLabel,
            accessibilityState,
            disabled,
            editable,
            errorText,
            errorTextProps,
            helperText,
            helperTextProps,
            invalid,
            label,
            labelProps,
            onBlur,
            onFocus,
            passwordToggle,
            placeholderTextColor,
            secureTextEntry,
        });

        const { colors, fonts, input } = useUITheme();
        const scaling = useScaling();
        const styles = useMemo(
            () => getStyles(colors, fonts, input, scaling, isFocused, isInvalid, disabled),
            [colors, disabled, fonts, input, isFocused, isInvalid, scaling],
        );
        const textInputStyle = [styles.text, multiline && styles.multilineText, style];
        const passwordHitSlop = canTogglePassword && passwordAction ? getPasswordHitSlop(scaling) : undefined;

        return (
            <View style={[styles.container, containerStyle]}>
                {label ? (
                    <View style={styles.labelContainer}>
                        <Typography
                            {...labelProps}
                            text={label}
                            variant={labelVariant}
                            color={labelColor}
                            style={labelProps?.style}
                        />
                    </View>
                ) : null}

                <View style={[styles.field, inputContainerStyle]}>
                    {startAccessory != null ? <View style={styles.startAccessory}>{startAccessory}</View> : null}
                    <TextInput
                        {...nativeProps}
                        ref={ref}
                        accessibilityLabel={resolvedAccessibilityLabel}
                        accessibilityHint={resolvedAccessibilityHint}
                        accessibilityState={resolvedAccessibilityState}
                        editable={resolvedEditable}
                        multiline={multiline}
                        placeholderTextColor={resolvedPlaceholderTextColor}
                        secureTextEntry={resolvedSecureTextEntry}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                        style={textInputStyle}
                    />
                    {endAccessory != null ? <View style={styles.endAccessory}>{endAccessory}</View> : null}
                    {canTogglePassword && passwordAction ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={passwordAction.label}
                            disabled={disabled}
                            hitSlop={passwordHitSlop}
                            onPress={onPasswordVisibilityToggle}
                            style={styles.passwordToggle}
                        >
                            {passwordAction.icon}
                        </Pressable>
                    ) : null}
                </View>

                {errorText ? (
                    <Typography
                        {...errorTextProps}
                        text={errorText}
                        variant={errorVariant}
                        color={errorColor}
                        accessibilityRole="alert"
                        accessibilityLiveRegion="polite"
                        style={[styles.supportingText, errorTextProps?.style]}
                    />
                ) : showHelperText && helperText ? (
                    <Typography
                        {...helperTextProps}
                        text={helperText}
                        variant={helperVariant}
                        color={helperColor}
                        style={[styles.supportingText, helperTextProps?.style]}
                    />
                ) : null}
            </View>
        );
    },
);

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent);
