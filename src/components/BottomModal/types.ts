import type { ReactNode, RefObject } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TypographyVariant } from '../../theme';

export interface BottomModalCloseAction {
    icon: ReactNode;
    accessibilityLabel: string;
    accessibilityHint?: string;
}

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
}
