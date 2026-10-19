import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface SwitchProps {
    value: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    width?: number;
    height?: number;
    thumbSize?: number;
    activeTrackColor?: string;
    inactiveTrackColor?: string;
    disabledTrackColor?: string;
    thumbColor?: string;
    disabledThumbColor?: string;
    thumb?: ReactNode;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
}
