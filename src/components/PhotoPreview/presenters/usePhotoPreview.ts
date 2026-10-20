import { useCallback, useEffect, useState } from 'react';
import type { PhotoPreviewProps } from '../types/types';

export const usePhotoPreview = ({
    fullscreen,
    disabled,
    onPress,
    onFullscreenOpen,
    onFullscreenClose,
}: Pick<PhotoPreviewProps, 'fullscreen' | 'disabled' | 'onPress' | 'onFullscreenOpen' | 'onFullscreenClose'>) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!fullscreen) setVisible(false);
    }, [fullscreen]);

    const onThumbnailPress = useCallback(() => {
        if (disabled) return;
        if (fullscreen) {
            setVisible(true);
            onFullscreenOpen?.();
        }
        onPress?.();
    }, [disabled, fullscreen, onFullscreenOpen, onPress]);

    const onClose = useCallback(() => {
        setVisible(false);
        onFullscreenClose?.();
    }, [onFullscreenClose]);

    return { visible: fullscreen === true && visible, onThumbnailPress, onClose };
};

type LoadState = 'loading' | 'loaded' | 'error';

export const useFullscreenImage = () => {
    const [loadState, setLoadState] = useState<LoadState>('loading');
    const onLoadStart = useCallback(() => setLoadState('loading'), []);
    const onLoad = useCallback(() => setLoadState('loaded'), []);
    const onError = useCallback(() => setLoadState('error'), []);

    return {
        isLoading: loadState === 'loading',
        isImageVisible: loadState === 'loaded',
        onLoadStart,
        onLoad,
        onError,
    };
};
