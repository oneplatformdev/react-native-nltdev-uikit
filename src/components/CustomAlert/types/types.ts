import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface CustomAlertCloseAction {
    icon: ReactNode;
    accessibilityLabel: string;
    accessibilityHint?: string;
}

export interface CustomAlertProps {
    visible: boolean;
    onClose: () => void;
    header?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    showHandle?: boolean;
    closeAction?: CustomAlertCloseAction;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}
