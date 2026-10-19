import { useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { useSwitch } from '../presenters/useSwitch';
import { getStyles, getSwitchGeometry, useSwitchAnimatedStyles } from './styles';
import type { SwitchProps } from '../types/types';

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

export const Switch = ({
    value,
    onValueChange,
    disabled = false,
    width = 40,
    height = 24,
    thumbSize = 20,
    activeTrackColor,
    inactiveTrackColor,
    disabledTrackColor,
    thumbColor,
    disabledThumbColor,
    thumb,
    accessibilityLabel,
    accessibilityHint,
    style,
}: SwitchProps) => {
    const { colors } = useUITheme();
    const scaling = useScaling();
    const geometry = useMemo(() => getSwitchGeometry(scaling, width, height, thumbSize), [scaling, width, height, thumbSize]);
    const styles = useMemo(
        () => getStyles(geometry, disabled ? disabledThumbColor ?? colors.surface : thumbColor ?? colors.background),
        [colors.background, colors.surface, disabled, disabledThumbColor, geometry, thumbColor],
    );
    const { onPress, progress } = useSwitch(value, disabled, onValueChange);
    const { trackStyle, thumbStyle } = useSwitchAnimatedStyles(
        progress,
        geometry.travelDistance,
        disabled ? disabledTrackColor ?? colors.disabled : inactiveTrackColor ?? colors.border,
        disabled ? disabledTrackColor ?? colors.disabled : activeTrackColor ?? colors.primary,
    );

    return (
        <AnimatedPressable
            accessibilityRole="switch"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ checked: value, disabled }}
            disabled={disabled}
            hitSlop={geometry.hitSlop}
            onPress={onPress}
            style={[styles.track, trackStyle, style]}
        >
            <Reanimated.View style={[styles.thumb, thumbStyle]} pointerEvents="none">
                {typeof thumb === 'string' || typeof thumb === 'number' ? <Text>{thumb}</Text> : thumb}
            </Reanimated.View>
        </AnimatedPressable>
    );
};
