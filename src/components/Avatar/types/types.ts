import type { ReactNode } from 'react';
import type { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';

export interface AvatarProps {
    source?: ImageSourcePropType;
    name?: string;
    fallbackText?: string;
    fallback?: ReactNode;
    size?: number;
    shape?: 'circle' | 'square';
    borderRadius?: number;
    backgroundColor?: string;
    textColor?: string;
    imageStyle?: StyleProp<ImageStyle>;
    style?: StyleProp<ViewStyle>;
    badge?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    imageAccessibilityLabel?: string;
}
