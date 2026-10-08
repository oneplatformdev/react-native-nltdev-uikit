import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TypographyProps } from '../Typography';

export interface HeaderWithBackButtonProps {
    title: string | number;
    subtitle?: string;
    onBackPress: () => void;
    backIcon: ReactNode;
    backAccessibilityLabel: string;
    backAccessibilityHint?: string;
    backDisabled?: boolean;
    rightAccessory?: ReactNode;
    titleAlign?: 'left' | 'center';
    titleVariant?: TypographyProps['variant'];
    titleSize?: TypographyProps['size'];
    subtitleVariant?: TypographyProps['variant'];
    subtitleSize?: TypographyProps['size'];
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}
