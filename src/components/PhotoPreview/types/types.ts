import type { ReactNode } from 'react';
import type { ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';

export interface PhotoPreviewProps {
    source: ImageSourcePropType;
    width?: number;
    height?: number;
    aspectRatio?: number;
    borderRadius?: number;
    resizeMode?: ImageResizeMode;
    overlay?: ReactNode;
    removeIcon?: ReactNode;
    onRemovePress?: () => void;
    removeAccessibilityLabel?: string;
    removeAccessibilityHint?: string;
    onPress?: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}
