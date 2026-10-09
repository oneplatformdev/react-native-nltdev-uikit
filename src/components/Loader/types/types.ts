import type { ReactNode } from 'react';
import type { ActivityIndicatorProps, StyleProp, ViewStyle } from 'react-native';

export interface LoaderProps {
    indicator?: ReactNode;
    inline?: boolean;
    transparent?: boolean;
    color?: ActivityIndicatorProps['color'];
    size?: ActivityIndicatorProps['size'];
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
}
