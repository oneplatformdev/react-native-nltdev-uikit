import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useUITheme } from '../../theme';
import { useScaling } from '../../utils';

export const useScreenContainer = () => {
    const { spacing } = useUITheme();
    const scaling = useScaling();
    const onContainerStartShouldSetResponder = useCallback(() => false, []);
    const onContainerResponderRelease = useCallback(() => Keyboard.dismiss(), []);

    return {
        bottomOffset: scaling.scaleVertical(spacing.xl),
        onContainerStartShouldSetResponder,
        onContainerResponderRelease,
    };
};
