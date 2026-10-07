import type { ComponentRef, ReactNode } from 'react';
import type { StyleProp, TextInput, TextInputProps, ViewStyle } from 'react-native';
import type { TypographyProps } from '../Typography';

export type InputRef = ComponentRef<typeof TextInput>;

export type InputTextProps = Pick<
    TypographyProps,
    'variant' | 'weight' | 'color' | 'style' | 'numberOfLines'
>;

export interface InputPasswordToggleAction {
    label: string;
    icon: ReactNode;
}

export interface InputPasswordToggle {
    show: InputPasswordToggleAction;
    hide: InputPasswordToggleAction;
}

export interface InputProps extends Omit<TextInputProps, 'ref'> {
    label?: string;
    helperText?: string;
    errorText?: string;
    invalid?: boolean;
    disabled?: boolean;
    startAccessory?: ReactNode;
    endAccessory?: ReactNode;
    passwordToggle?: InputPasswordToggle;
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    labelProps?: InputTextProps;
    helperTextProps?: InputTextProps;
    errorTextProps?: InputTextProps;
}
