import React, { forwardRef, memo } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Typography } from '../Typography';
import { useInputPresenter } from './InputPresenter';
import type { InputProps, InputRef } from './types';

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
            labelColor,
            labelVariant,
            onInputBlur,
            onInputFocus,
            onPasswordVisibilityToggle,
            passwordAction,
            passwordHitSlop,
            resolvedAccessibilityHint,
            resolvedAccessibilityLabel,
            resolvedAccessibilityState,
            resolvedEditable,
            resolvedPlaceholderTextColor,
            resolvedSecureTextEntry,
            showHelperText,
            styles,
            textInputStyle,
        } = useInputPresenter({
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
            multiline,
            onBlur,
            onFocus,
            passwordToggle,
            placeholderTextColor,
            secureTextEntry,
            style,
        });

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
