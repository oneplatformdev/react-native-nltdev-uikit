import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ConnectionContainerProps {
    /** null means connectivity is not yet known. */
    isConnected: boolean | null;
    disconnectedText: string;
    reconnectedText: string;
    children?: ReactNode;
    disconnectedIcon?: ReactNode;
    reconnectedIcon?: ReactNode;
    dismissAccessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
}
