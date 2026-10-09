import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConnectionContainerProps } from '../types/types';

type ConnectionStatus = 'disconnected' | 'reconnected' | null;

const DISCONNECT_DELAY = 3000;
const RECONNECT_VISIBLE_TIME = 3000;

export const useConnectionContainer = ({
    isConnected,
    disconnectedText,
    reconnectedText,
}: Pick<ConnectionContainerProps, 'isConnected' | 'disconnectedText' | 'reconnectedText'>) => {
    const [status, setStatus] = useState<ConnectionStatus>(null);
    const initializedRef = useRef(false);
    const disconnectedBannerShownRef = useRef(false);
    const disconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearDisconnectTimeout = useCallback(() => {
        if (disconnectTimeoutRef.current !== null) {
            clearTimeout(disconnectTimeoutRef.current);
            disconnectTimeoutRef.current = null;
        }
    }, []);
    const clearHideTimeout = useCallback(() => {
        if (hideTimeoutRef.current !== null) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    }, []);
    const onHideBanner = useCallback(() => {
        clearHideTimeout();
        setStatus(null);
    }, [clearHideTimeout]);

    useEffect(() => {
        if (isConnected === null) return;
        if (!initializedRef.current) {
            initializedRef.current = true;
            if (isConnected) return;
        }

        if (!isConnected) {
            if (disconnectTimeoutRef.current !== null || disconnectedBannerShownRef.current) return;
            clearHideTimeout();
            disconnectTimeoutRef.current = setTimeout(() => {
                disconnectTimeoutRef.current = null;
                disconnectedBannerShownRef.current = true;
                setStatus('disconnected');
            }, DISCONNECT_DELAY);
            return;
        }

        clearDisconnectTimeout();
        if (!disconnectedBannerShownRef.current) return;
        disconnectedBannerShownRef.current = false;
        clearHideTimeout();
        setStatus('reconnected');
        hideTimeoutRef.current = setTimeout(() => {
            hideTimeoutRef.current = null;
            setStatus(null);
        }, RECONNECT_VISIBLE_TIME);
    }, [isConnected, clearDisconnectTimeout, clearHideTimeout]);

    useEffect(() => () => {
        clearDisconnectTimeout();
        clearHideTimeout();
    }, [clearDisconnectTimeout, clearHideTimeout]);

    return {
        visible: status !== null,
        isReconnected: status === 'reconnected',
        text: status === 'reconnected' ? reconnectedText : disconnectedText,
        onHideBanner,
    };
};
