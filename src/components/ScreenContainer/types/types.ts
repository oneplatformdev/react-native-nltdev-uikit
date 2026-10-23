import type { ComponentRef, ReactNode, Ref } from 'react';
import type { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import type { KeyboardAwareScrollViewRef, KeyboardAvoidingViewProps } from 'react-native-keyboard-controller';
import type { LinearGradientProps } from 'react-native-linear-gradient';
import type { Edge } from 'react-native-safe-area-context';

export type ScreenContainerGradient = Pick<LinearGradientProps, 'colors' | 'locations' | 'start' | 'end'>;

export interface ScreenContainerProps extends Omit<ScrollViewProps, 'children' | 'style' | 'contentContainerStyle' | 'scrollViewRef'> {
    children?: ReactNode;
    edges?: Edge[];
    isKeyboardAvoiding?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    headerComponent?: ReactNode;
    footerComponent?: ReactNode;
    background?: ReactNode;
    overlay?: ReactNode;
    scrollViewRef?: Ref<ComponentRef<typeof ScrollView>>;
    keyboardScrollViewRef?: Ref<KeyboardAwareScrollViewRef>;
    keyboardAvoidingBehavior?: KeyboardAvoidingViewProps['behavior'] | null;
    gradient?: ScreenContainerGradient;
}
