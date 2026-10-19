import { useCallback, useEffect } from 'react';
import { ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SwitchProps } from '../types/types';

export const useSwitch = (
    value: boolean,
    disabled: boolean,
    onValueChange: SwitchProps['onValueChange'],
) => {
    const progress = useSharedValue(value ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(value ? 1 : 0, { duration: 200, reduceMotion: ReduceMotion.System });
    }, [progress, value]);

    const onPress = useCallback(() => {
        if (!disabled) onValueChange?.(!value);
    }, [disabled, onValueChange, value]);

    return { onPress, progress };
};
