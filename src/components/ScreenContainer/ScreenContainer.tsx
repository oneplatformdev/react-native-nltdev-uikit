import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { LinearGradient } from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUITheme } from '../../theme';
import { getStyles } from './styles';
import type { ScreenContainerProps } from './types';
import { useScreenContainer } from './useScreenContainer';

export const ScreenContainer = ({
    children,
    edges = ['top', 'bottom'],
    scrollEnabled = false,
    isKeyboardAvoiding = false,
    containerStyle,
    contentContainerStyle,
    headerComponent,
    footerComponent,
    scrollViewRef,
    keyboardScrollViewRef,
    keyboardShouldPersistTaps = 'handled',
    showsVerticalScrollIndicator = false,
    gradient,
    ...scrollProps
}: ScreenContainerProps) => {
    const { colors } = useUITheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { bottomOffset, onContainerStartShouldSetResponder, onContainerResponderRelease } = useScreenContainer();

    return (
        <View style={styles.root}>
            {gradient ? <LinearGradient {...gradient} pointerEvents="none" style={styles.gradient} /> : null}
            <SafeAreaView edges={edges} style={styles.safeArea}>
                {headerComponent}

                {scrollEnabled ? (
                    isKeyboardAvoiding ? (
                        <KeyboardAwareScrollView
                            {...scrollProps}
                            ref={keyboardScrollViewRef}
                            bottomOffset={bottomOffset}
                            style={[styles.container, containerStyle]}
                            contentContainerStyle={[styles.content, contentContainerStyle]}
                            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                        >
                            {children}
                        </KeyboardAwareScrollView>
                    ) : (
                        <ScrollView
                            {...scrollProps}
                            ref={scrollViewRef}
                            style={[styles.container, containerStyle]}
                            contentContainerStyle={[styles.content, contentContainerStyle]}
                            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                        >
                            {children}
                        </ScrollView>
                    )
                ) : isKeyboardAvoiding ? (
                    <KeyboardAvoidingView behavior="padding" style={[styles.container, containerStyle]}>
                        <View
                            style={styles.container}
                            onStartShouldSetResponder={onContainerStartShouldSetResponder}
                            onResponderRelease={onContainerResponderRelease}
                        >
                            {children}
                        </View>
                    </KeyboardAvoidingView>
                ) : (
                    <View style={[styles.container, containerStyle]}>{children}</View>
                )}

                {footerComponent}
            </SafeAreaView>
        </View>
    );
};
