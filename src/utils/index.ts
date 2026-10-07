import { useMemo } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

export type DesignBaseline = Readonly<{
    width: number;
    height: number;
}>;

export type ScalingFunctions = {
    scaleHorizontal: (value?: number) => number;
    scaleVertical: (value?: number) => number;
    scaleFontSize: (value?: number) => number;
    scaleLineHeight: (value?: number) => number;
};

export const defaultDesignBaseline: DesignBaseline = {
    width: 390,
    height: 844,
};

let configuredDesignBaseline: DesignBaseline = defaultDesignBaseline;

/**
 * Configures the process-wide design baseline. Call this before rendering the application.
 */
export const configureScaling = ({ width, height }: DesignBaseline): void => {
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
        throw new RangeError('Scaling baseline width and height must be finite positive numbers.');
    }

    configuredDesignBaseline = { width, height };
};

type ScalingRatios = {
    horizontal: number;
    vertical: number;
};

const getScalingRatios = (width: number, height: number, baseline: DesignBaseline): ScalingRatios => {
    const horizontal = width / baseline.width;
    const vertical = height / baseline.height;

    return {
        horizontal,
        vertical,
    };
};

const createScalingFunctions = (width: number, height: number, baseline: DesignBaseline): ScalingFunctions => {
    const ratios = getScalingRatios(width, height, baseline);

    return {
        scaleHorizontal: (value: number = 1): number => value * ratios.horizontal,
        scaleVertical: (value: number = 1): number => value * ratios.vertical,
        scaleFontSize: (value: number = 1): number => value * ratios.horizontal,
        scaleLineHeight: (value: number = 1): number => value * ratios.horizontal,
    };
};

const getCurrentScalingRatios = (): ScalingRatios => {
    const { width, height } = Dimensions.get('window');
    return getScalingRatios(width, height, configuredDesignBaseline);
};

export const scaleHorizontal = (value: number = 1): number => {
    return value * getCurrentScalingRatios().horizontal;
};

export const scaleVertical = (value: number = 1): number => {
    return value * getCurrentScalingRatios().vertical;
};

export const scaleFontSize = (value: number = 1): number => {
    return value * getCurrentScalingRatios().horizontal;
};

export const scaleLineHeight = (value: number = 1): number => {
    return value * getCurrentScalingRatios().horizontal;
};

export const useScaling = (): ScalingFunctions => {
    const { width, height } = useWindowDimensions();
    const { width: baselineWidth, height: baselineHeight } = configuredDesignBaseline;

    return useMemo(
        () => createScalingFunctions(width, height, { width: baselineWidth, height: baselineHeight }),
        [width, height, baselineWidth, baselineHeight],
    );
};

/**
 * @deprecated This is a module-load snapshot. Use useWindowDimensions or Dimensions.get('window').
 */
export const size: { width: number; height: number } = Dimensions.get('window');
