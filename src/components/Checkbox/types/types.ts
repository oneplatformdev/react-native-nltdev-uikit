import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface CheckboxProps {
    checked: boolean;
    onValueChange?: (checked: boolean) => void;
    interactive?: boolean;
    disabled?: boolean;
    size?: number;
    shape?: 'square' | 'circle';
    borderRadius?: number;
    borderWidth?: number;
    checkedBackgroundColor?: string;
    uncheckedBackgroundColor?: string;
    checkedBorderColor?: string;
    uncheckedBorderColor?: string;
    disabledBackgroundColor?: string;
    disabledBorderColor?: string;
    icon?: ReactNode;
    iconSize?: number;
    iconColor?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
}
