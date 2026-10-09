import { useCallback, useEffect, useMemo } from 'react';
import { Animated, Easing, Keyboard, PanResponder, useWindowDimensions } from 'react-native';
import type { BottomModalProps } from '../types/types';
import { useBottomModalInsets } from './useBottomModalInsets';

type UseBottomModalProps = Pick<BottomModalProps, 'onClose' | 'closeRef'>;

const CLOSE_DISTANCE = 120;
const CLOSE_VELOCITY = 1;
const OPEN_ANIMATION_DURATION = 280;
const CLOSE_ANIMATION_DURATION = 250;

const isDragDownGesture = (gestureState: { dx: number; dy: number }) =>
    gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);

export const useBottomModal = ({
    onClose,
    closeRef,
}: UseBottomModalProps) => {
    const { height } = useWindowDimensions();
    const { topInset, bottomInset } = useBottomModalInsets();
    const translateY = useMemo(() => new Animated.Value(height), [height]);
    const backdropOpacity = useMemo(() => new Animated.Value(0), []);

    const onRunCloseAnimation = useCallback(
        (shouldNotify = true) => {
            translateY.stopAnimation();
            backdropOpacity.stopAnimation();
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height,
                    duration: CLOSE_ANIMATION_DURATION,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: CLOSE_ANIMATION_DURATION,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished && shouldNotify) onClose();
            });
        },
        [backdropOpacity, height, onClose, translateY],
    );
    const onCloseAnimated = useCallback(
        (shouldNotify = true) => {
            Keyboard.dismiss();
            onRunCloseAnimation(shouldNotify);
        },
        [onRunCloseAnimation],
    );
    const onClosePress = useCallback(() => onCloseAnimated(), [onCloseAnimated]);
    const onShow = useCallback(() => {
        translateY.stopAnimation();
        backdropOpacity.stopAnimation();
        translateY.setValue(height);
        backdropOpacity.setValue(0);
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: OPEN_ANIMATION_DURATION,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: OPEN_ANIMATION_DURATION,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [backdropOpacity, height, translateY]);

    useEffect(() => {
        if (!closeRef) return;
        closeRef.current = onClosePress;
        return () => { closeRef.current = null; };
    }, [closeRef, onClosePress]);

    const panResponder = useMemo(
        () => PanResponder.create({
            onMoveShouldSetPanResponderCapture: (_, gestureState) => isDragDownGesture(gestureState),
            onMoveShouldSetPanResponder: (_, gestureState) => isDragDownGesture(gestureState),
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > CLOSE_DISTANCE || gestureState.vy > CLOSE_VELOCITY) {
                    onCloseAnimated();
                    return;
                }
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 18 }).start();
            },
            onPanResponderTerminate: () => {
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 18 }).start();
            },
        }),
        [onCloseAnimated, translateY],
    );

    return {
        height,
        topInset,
        bottomInset,
        translateY,
        backdropOpacity,
        onClosePress,
        onShow,
        panHandlers: panResponder.panHandlers,
    };
};
