import { useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

const getAndroidNavigationInset = () => {
    if (Platform.OS !== 'android') return 0;
    return Math.max(0, Dimensions.get('screen').height - Dimensions.get('window').height);
};

export const useBottomModalInsets = (requestedTopInset?: number) => {
    const { top, bottom } = useSafeAreaInsets();
    const topInset = useMemo(() => {
        const defaultTopInset = Math.max(top, initialWindowMetrics?.insets.top || 0);
        return requestedTopInset === undefined || !Number.isFinite(requestedTopInset)
            ? defaultTopInset : Math.max(0, requestedTopInset);
    }, [requestedTopInset, top]);
    const bottomInset = useMemo(
        () => Math.max(bottom, initialWindowMetrics?.insets.bottom || 0, getAndroidNavigationInset()),
        [bottom],
    );

    return { topInset, bottomInset };
};
