import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, PanResponder, useWindowDimensions } from 'react-native';
import type { BottomModalCloseReason, BottomModalProps } from '../types/types';
import { useBottomModalInsets } from './useBottomModalInsets';

type UseBottomModalProps = Pick<
    BottomModalProps,
    'visible' | 'onClose' | 'onCloseRequest' | 'onDismiss' | 'closeRef' | 'topInset' | 'sizing' | 'dragToDismiss'
>;

const CLOSE_DISTANCE = 120;
const CLOSE_VELOCITY = 1;
const OPEN_ANIMATION_DURATION = 280;
const CLOSE_ANIMATION_DURATION = 250;

const isDragDownGesture = (gestureState: { dx: number; dy: number }) =>
    gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
const isVerticalGesture = (gestureState: { dx: number; dy: number }) =>
    gestureState.dy !== 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);

export const useBottomModal = ({
    visible,
    onClose,
    onCloseRequest,
    onDismiss,
    closeRef,
    topInset: requestedTopInset,
    sizing,
    dragToDismiss,
}: UseBottomModalProps) => {
    const { height } = useWindowDimensions();
    const { topInset, bottomInset } = useBottomModalInsets(requestedTopInset);
    const isExpandable = sizing?.mode === 'expandable';
    const initialFraction = sizing?.mode === 'expandable' ? sizing.initialFraction : undefined;
    const validInitialFraction = initialFraction !== undefined && Number.isFinite(initialFraction)
        && initialFraction > 0 && initialFraction < 1;
    if (__DEV__ && isExpandable && !validInitialFraction) {
        throw new Error('BottomModal expandable initialFraction must be finite, greater than 0 and less than 1.');
    }
    const maxHeight = Math.max(0, height - topInset);
    const collapsedHeight = maxHeight * (validInitialFraction ? initialFraction : 0.6);
    const [translateY] = useState(() => new Animated.Value(height));
    const [backdropOpacity] = useState(() => new Animated.Value(0));
    const [expandableHeight] = useState(() => new Animated.Value(collapsedHeight));
    const expandedRef = useRef(false);
    const previousVisibleRef = useRef(visible);
    const visibleRef = useRef(visible);
    const openedRef = useRef(false);
    const closingRef = useRef(false);
    const animationIdRef = useRef(0);
    const onCloseRef = useRef(onClose);
    const onCloseRequestRef = useRef(onCloseRequest);
    visibleRef.current = visible;
    onCloseRef.current = onClose;
    onCloseRequestRef.current = onCloseRequest;

    useLayoutEffect(() => {
        if (!isExpandable) {
            expandedRef.current = false;
            expandableHeight.stopAnimation();
            return;
        }
        expandableHeight.stopAnimation();
        expandableHeight.setValue(expandedRef.current ? maxHeight : collapsedHeight);
    }, [collapsedHeight, expandableHeight, isExpandable, maxHeight]);

    const onResize = useCallback((expanded: boolean) => {
        if (closingRef.current) return;
        expandedRef.current = expanded;
        expandableHeight.stopAnimation();
        Animated.timing(expandableHeight, {
            toValue: expanded ? maxHeight : collapsedHeight,
            duration: CLOSE_ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [collapsedHeight, expandableHeight, maxHeight]);

    const onRunCloseAnimation = useCallback(
        (shouldNotify: boolean, reason?: BottomModalCloseReason) => {
            if (closingRef.current) return;
            closingRef.current = true;
            const animationId = ++animationIdRef.current;
            if (reason) onCloseRequestRef.current?.(reason);
            Keyboard.dismiss();
            if (isExpandable) expandableHeight.stopAnimation();
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
                if (!finished || animationId !== animationIdRef.current) return;
                closingRef.current = false;
                if (shouldNotify) onCloseRef.current();
            });
        },
        [backdropOpacity, expandableHeight, height, isExpandable, translateY],
    );
    const onRunOpenAnimation = useCallback((reset: boolean) => {
        ++animationIdRef.current;
        closingRef.current = false;
        translateY.stopAnimation();
        backdropOpacity.stopAnimation();
        if (reset) {
            translateY.setValue(height);
            backdropOpacity.setValue(0);
        }
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
    const onShow = useCallback(() => {
        if (!visibleRef.current || closingRef.current || openedRef.current) return;
        openedRef.current = true;
        onRunOpenAnimation(true);
    }, [onRunOpenAnimation]);

    useLayoutEffect(() => {
        const wasVisible = previousVisibleRef.current;
        previousVisibleRef.current = visible;
        if (visible === wasVisible) return;
        ++animationIdRef.current;
        closingRef.current = false;
        translateY.stopAnimation();
        backdropOpacity.stopAnimation();
        if (visible) {
            expandedRef.current = false;
            if (isExpandable) expandableHeight.setValue(collapsedHeight);
            openedRef.current = true;
            onRunOpenAnimation(false);
        } else {
            openedRef.current = false;
            if (isExpandable) {
                expandableHeight.stopAnimation();
                expandedRef.current = false;
                expandableHeight.setValue(collapsedHeight);
            }
            translateY.setValue(height);
            backdropOpacity.setValue(0);
            // Report the controlled hidden commit, not native dialog teardown.
            onDismiss?.();
        }
    }, [backdropOpacity, collapsedHeight, expandableHeight, height, isExpandable, onDismiss, onRunOpenAnimation, translateY, visible]);

    const onClosePress = useCallback(() => onRunCloseAnimation(true), [onRunCloseAnimation]);
    const onCloseAction = useCallback(() => onRunCloseAnimation(true, 'closeAction'), [onRunCloseAnimation]);
    const onBackdropPress = useCallback(() => onRunCloseAnimation(true, 'backdrop'), [onRunCloseAnimation]);
    const onHardwareBack = useCallback(() => onRunCloseAnimation(true, 'hardwareBack'), [onRunCloseAnimation]);
    const onGestureClose = useCallback(() => onRunCloseAnimation(true, 'gesture'), [onRunCloseAnimation]);

    useEffect(() => () => {
        ++animationIdRef.current;
        translateY.stopAnimation();
        backdropOpacity.stopAnimation();
        expandableHeight.stopAnimation();
    }, [backdropOpacity, expandableHeight, translateY]);

    useEffect(() => {
        if (!closeRef) return;
        closeRef.current = onClosePress;
        return () => { closeRef.current = null; };
    }, [closeRef, onClosePress]);

    const panResponder = useMemo(
        () => PanResponder.create({
            onMoveShouldSetPanResponderCapture: (_, gestureState) => isExpandable
                ? isVerticalGesture(gestureState) : isDragDownGesture(gestureState),
            onMoveShouldSetPanResponder: (_, gestureState) => isExpandable
                ? isVerticalGesture(gestureState) : isDragDownGesture(gestureState),
            onPanResponderMove: (_, gestureState) => {
                if (isExpandable) return;
                if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isExpandable) {
                    const swipedUp = -gestureState.dy > CLOSE_DISTANCE || -gestureState.vy > CLOSE_VELOCITY;
                    const swipedDown = gestureState.dy > CLOSE_DISTANCE || gestureState.vy > CLOSE_VELOCITY;
                    if (expandedRef.current && swipedDown) onResize(false);
                    else if (!expandedRef.current && swipedUp) onResize(true);
                    else if (!expandedRef.current && swipedDown && dragToDismiss === 'handle') onGestureClose();
                    return;
                }
                if (gestureState.dy > CLOSE_DISTANCE || gestureState.vy > CLOSE_VELOCITY) {
                    onGestureClose();
                    return;
                }
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 18 }).start();
            },
            onPanResponderTerminate: () => {
                if (isExpandable) return;
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 18 }).start();
            },
        }),
        [dragToDismiss, isExpandable, onGestureClose, onResize, translateY],
    );

    return {
        height,
        topInset,
        bottomInset,
        translateY,
        backdropOpacity,
        expandableHeight,
        isExpandable,
        onCloseAction,
        onBackdropPress,
        onHardwareBack,
        onShow,
        panHandlers: panResponder.panHandlers,
    };
};
