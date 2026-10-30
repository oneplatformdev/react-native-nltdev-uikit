import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TypographyProps } from '../../Typography';

export interface HeaderWithBackButtonProps {
    title?: string | number;
    titleComponent?: ReactNode;
    subtitle?: string;
    onBackPress: () => void;
    backIcon: ReactNode;
    backButtonSize?: number;
    backAccessibilityLabel: string;
    backAccessibilityHint?: string;
    /** Whether the back control is rendered and occupies layout space. Defaults to true. */
    backVisible?: boolean;
    /** Keeps the visible back control rendered but prevents activation. Defaults to false. */
    backDisabled?: boolean;
    rightAccessory?: ReactNode;
    /** `center` uses the whole header; `available-center` uses the space between side controls. */
    titleAlign?: 'left' | 'center' | 'available-center';
    titleVariant?: TypographyProps['variant'];
    titleSize?: TypographyProps['size'];
    titleNumberOfLines?: number;
    subtitleVariant?: TypographyProps['variant'];
    subtitleSize?: TypographyProps['size'];
    subtitleNumberOfLines?: number;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}
