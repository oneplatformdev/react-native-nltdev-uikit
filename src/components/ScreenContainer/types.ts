import type { ReactNode, Ref } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import type { KeyboardAwareScrollViewRef } from 'react-native-keyboard-controller';
import type { LinearGradientProps } from 'react-native-linear-gradient';
import type { Edge } from 'react-native-safe-area-context';

export type ScreenContainerGradient = Pick<LinearGradientProps, 'colors' | 'locations' | 'start' | 'end'>;

export interface ScreenContainerProps extends Omit<ScrollViewProps, 'children' | 'style' | 'contentContainerStyle'> {
    children?: ReactNode;
    edges?: Edge[];
    isKeyboardAvoiding?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    headerComponent?: ReactNode;
    footerComponent?: ReactNode;
    keyboardScrollViewRef?: Ref<KeyboardAwareScrollViewRef>;
    gradient?: ScreenContainerGradient;
}
