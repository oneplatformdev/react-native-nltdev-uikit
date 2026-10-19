import { useCallback, useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';

const getSourceKey = (source?: ImageSourcePropType): string | null => {
    if (typeof source === 'number') return Number.isFinite(source) ? `asset:${source}` : null;
    if (Array.isArray(source)) {
        return source.some(item => typeof item.uri === 'string' && item.uri.trim()) ? JSON.stringify(source) : null;
    }
    return source && 'uri' in source && typeof source.uri === 'string' && source.uri.trim()
        ? JSON.stringify(source) : null;
};

export const getInitials = (name?: string): string => name?.trim().split(/\s+/).slice(0, 2)
    .map(word => Array.from(word)[0]?.toUpperCase() ?? '').join('') ?? '';

export const useAvatar = (source?: ImageSourcePropType, name?: string) => {
    const sourceKey = getSourceKey(source);
    const [failedSourceKey, setFailedSourceKey] = useState<string | null>(null);

    useEffect(() => {
        setFailedSourceKey(null);
    }, [sourceKey]);

    const onImageError = useCallback(() => {
        setFailedSourceKey(sourceKey);
    }, [sourceKey]);

    return {
        showImage: sourceKey !== null && failedSourceKey !== sourceKey,
        onImageError,
        initials: getInitials(name),
    };
};
