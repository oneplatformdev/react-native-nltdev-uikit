import type { ReactNode, RefObject } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TypographyVariant } from '../../../theme';

export interface BottomModalCloseAction {
    icon: ReactNode;
    accessibilityLabel: string;
    accessibilityHint?: string;
}

export type BottomModalSizing =
    | { mode: 'content' }
    | { mode: 'fixed'; fraction: number }
    | { mode: 'fullscreen' }
    | { mode: 'expandable'; initialFraction: number };

export type BottomModalBackdrop = false | {
    color?: string;
    opacity?: number;
    dismissOnPress?: boolean;
};

export type BottomModalCloseReason = 'closeAction' | 'backdrop' | 'gesture' | 'hardwareBack';

export interface BottomModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    closeRef?: RefObject<(() => void) | null>;
    title?: string;
    titleVariant?: TypographyVariant;
    customHeader?: ReactNode;
    closeAction?: BottomModalCloseAction;
    contentContainerStyle?: StyleProp<ViewStyle>;
    isFullScreen?: boolean;
    shouldAvoidKeyboard?: boolean;
    sizing?: BottomModalSizing;
    topInset?: number;
    showHeader?: boolean;
    backdrop?: BottomModalBackdrop;
    cornerRadius?: number;
    dragToDismiss?: 'none' | 'handle';
    onCloseRequest?: (reason: BottomModalCloseReason) => void;
    onDismiss?: () => void;
}
