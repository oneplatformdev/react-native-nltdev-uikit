import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../Typography';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { getStyles } from './styles';
import type { ConnectionContainerProps } from '../types/types';
import { useConnectionContainer } from '../presenters/useConnectionContainer';

export const ConnectionContainer = ({
    isConnected,
    disconnectedText,
    reconnectedText,
    children,
    disconnectedIcon,
    reconnectedIcon,
    dismissAccessibilityHint,
    style,
}: ConnectionContainerProps) => {
    const { colors, spacing } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(() => getStyles(colors, spacing, scaling), [colors, scaling, spacing]);
    const { visible, isReconnected, text, onHideBanner } = useConnectionContainer({
        isConnected,
        disconnectedText,
        reconnectedText,
    });

    if (!visible) return children == null ? null : <>{children}</>;

    return (
        <>
            {children}
            <SafeAreaView edges={['top', 'left', 'right']} pointerEvents="box-none" style={[styles.container, style]}>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={text}
                    accessibilityHint={dismissAccessibilityHint}
                    activeOpacity={0.8}
                    onPress={onHideBanner}
                >
                    <View style={[styles.content, isReconnected ? styles.reconnected : styles.disconnected]}>
                        {isReconnected ? reconnectedIcon : disconnectedIcon}
                        <Typography text={text} variant="label" weight="bold" style={styles.text} accessibilityLiveRegion="polite" />
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
};
