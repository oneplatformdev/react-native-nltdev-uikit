import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { LinearGradient } from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { getBottomOffset, getStyles } from './styles';
import type { ScreenContainerProps } from '../types/types';
import { useScreenContainer } from '../presenters/useScreenContainer';

export const ScreenContainer = ({
    children,
    edges = ['top', 'bottom'],
    scrollEnabled = false,
    isKeyboardAvoiding = false,
    containerStyle,
    contentContainerStyle,
    headerComponent,
    footerComponent,
    background,
    overlay,
    scrollViewRef,
    keyboardScrollViewRef,
    keyboardAvoidingBehavior,
    keyboardShouldPersistTaps = 'handled',
    showsVerticalScrollIndicator = false,
    gradient,
    ...scrollProps
}: ScreenContainerProps) => {
    const { colors, spacing } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const bottomOffset = getBottomOffset(spacing, scaling);
    const { onContainerStartShouldSetResponder, onContainerResponderRelease } = useScreenContainer();
    const keyboardAvoidingViewProps = keyboardAvoidingBehavior === null
        ? {}
        : { behavior: keyboardAvoidingBehavior ?? 'padding' };

    return (
        <View style={styles.root}>
            {background != null ? (
                <View pointerEvents="none" style={styles.layer}>{background}</View>
            ) : gradient ? (
                <LinearGradient {...gradient} pointerEvents="none" style={styles.layer} />
            ) : null}
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
                    <KeyboardAvoidingView {...keyboardAvoidingViewProps} style={[styles.container, containerStyle]}>
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
            {overlay != null ? (
                <View pointerEvents="box-none" style={styles.layer}>{overlay}</View>
            ) : null}
        </View>
    );
};
