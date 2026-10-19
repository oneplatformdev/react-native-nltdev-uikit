import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { TypographyProps } from '../../Typography';

export interface EmptyListViewProps {
    visual?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    titleVariant?: TypographyProps['variant'];
    descriptionVariant?: TypographyProps['variant'];
    actionLabel?: string;
    onActionPress?: () => void;
    action?: ReactNode;
    /** Labels the optional visual without grouping the readable text and action. */
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    visualStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
}
