import { StyleSheet } from 'react-native';
import { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { ScalingFunctions } from '../../../utils';

const positiveOr = (value: number, fallback: number) => Number.isFinite(value) && value > 0 ? value : fallback;

export const getSwitchGeometry = (scaling: ScalingFunctions, width: number, height: number, thumbSize: number) => {
    const designWidth = positiveOr(width, 40);
    const designHeight = positiveOr(height, 24);
    const designPadding = Math.min(2, designWidth / 4, designHeight / 4);
    const designThumb = Math.min(positiveOr(thumbSize, 20), Math.min(designWidth, designHeight) - 2 * designPadding);
    const trackWidth = scaling.scaleHorizontal(designWidth);
    const trackHeight = scaling.scaleHorizontal(designHeight);
    const padding = scaling.scaleHorizontal(designPadding);
    const thumb = scaling.scaleHorizontal(designThumb);

    return {
        trackWidth,
        trackHeight,
        padding,
        thumb,
        travelDistance: Math.max(0, trackWidth - 2 * padding - thumb),
        hitSlop: {
            top: scaling.scaleHorizontal(Math.max(10, (44 - designHeight) / 2)),
            bottom: scaling.scaleHorizontal(Math.max(10, (44 - designHeight) / 2)),
            left: scaling.scaleHorizontal(Math.max(10, (44 - designWidth) / 2)),
            right: scaling.scaleHorizontal(Math.max(10, (44 - designWidth) / 2)),
        },
    };
};

export const getStyles = (geometry: ReturnType<typeof getSwitchGeometry>, thumbColor: string) => {
    const styles = StyleSheet.create({
        track: {
            width: geometry.trackWidth,
            height: geometry.trackHeight,
            padding: geometry.padding,
            borderRadius: geometry.trackHeight / 2,
            justifyContent: 'center',
            flexShrink: 0,
        },
        thumb: {
            width: geometry.thumb,
            height: geometry.thumb,
            borderRadius: geometry.thumb / 2,
            backgroundColor: thumbColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return styles;
};

export const useSwitchAnimatedStyles = (
    progress: SharedValue<number>,
    travelDistance: number,
    inactiveTrackColor: string,
    activeTrackColor: string,
) => {
    const trackStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], [inactiveTrackColor, activeTrackColor]),
    }));
    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: progress.value * travelDistance }],
    }));

    return { trackStyle, thumbStyle };
};
