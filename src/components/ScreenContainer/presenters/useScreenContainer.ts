import { useCallback } from 'react';
import { Keyboard } from 'react-native';

export const useScreenContainer = () => {
    const onContainerStartShouldSetResponder = useCallback(() => false, []);
    const onContainerResponderRelease = useCallback(() => Keyboard.dismiss(), []);

    return {
        onContainerStartShouldSetResponder,
        onContainerResponderRelease,
    };
};
