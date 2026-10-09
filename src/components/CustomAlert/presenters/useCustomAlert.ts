import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type { CustomAlertProps } from '../types/types';

export const useCustomAlert = ({ visible, onClose }: Pick<CustomAlertProps, 'visible' | 'onClose'>) => {
    const [isVisible, setIsVisible] = useState(visible);
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const onClosePress = useCallback(() => onClose(), [onClose]);

    useEffect(() => {
        if (visible) setIsVisible(true);
        const animation = Animated.parallel([
            Animated.timing(backdropOpacity, { toValue: visible ? 1 : 0, duration: 200, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: visible ? 1 : 0.8, duration: 200, useNativeDriver: true }),
        ]);
        animation.start(({ finished }) => {
            if (finished && !visible) setIsVisible(false);
        });
        return () => animation.stop();
    }, [visible, backdropOpacity, scaleAnim]);

    return { isVisible, backdropOpacity, scaleAnim, onClosePress };
};
