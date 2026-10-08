import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUITheme } from '../../theme';
import { getStyles } from './styles';
import type { LoaderProps } from './types';

export const Loader = ({
    indicator,
    inline = false,
    transparent = false,
    color,
    size = 'large',
    accessibilityLabel,
    style,
}: LoaderProps) => {
    const { colors } = useUITheme();
    const styles = useMemo(() => getStyles(colors, inline, transparent), [colors, inline, transparent]);

    return (
        <View
            accessibilityRole="progressbar"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ busy: true }}
            style={[styles.container, style]}
        >
            {indicator === undefined ? <ActivityIndicator color={color ?? colors.primary} size={size} /> : indicator}
        </View>
    );
};
