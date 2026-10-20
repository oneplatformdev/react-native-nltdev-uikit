import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { FastImageProps } from '@d11/react-native-fast-image';

export interface PhotoPreviewProps {
    source: NonNullable<FastImageProps['source']>;
    width?: number;
    height?: number;
    aspectRatio?: number;
    borderRadius?: number;
    resizeMode?: FastImageProps['resizeMode'];
    fullscreen?: boolean;
    fullscreenResizeMode?: FastImageProps['resizeMode'];
    fullscreenBackgroundColor?: string;
    fullscreenImageStyle?: FastImageProps['style'];
    closeIcon?: ReactNode;
    closeAccessibilityLabel?: string;
    closeAccessibilityHint?: string;
    loadingIndicator?: ReactNode;
    onFullscreenOpen?: () => void;
    onFullscreenClose?: () => void;
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
    imageStyle?: FastImageProps['style'];
}
