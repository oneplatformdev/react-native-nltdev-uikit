import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import type { TypographyProps } from '../Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonLoadingAppearance = 'active' | 'disabled';

export type ButtonLabelProps = Omit<
    TypographyProps,
    | 'children'
    | 'text'
    | 'onPress'
    | 'onLongPress'
    | 'onPressIn'
    | 'onPressOut'
    | 'accessible'
    | 'accessibilityLabel'
    | 'accessibilityHint'
    | 'accessibilityRole'
    | 'accessibilityState'
>;

export type ButtonProps = Omit<PressableProps, 'children'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingAppearance?: ButtonLoadingAppearance;
    loadingIndicatorColor?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    labelProps?: ButtonLabelProps;
} & (
    | { text: string | number; children?: never }
    | { text?: never; children?: ReactNode }
);
