import React, { FC } from "react";
import { View } from 'react-native';
import Svg, { Path } from "react-native-svg";

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    position?: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';

}

const TRANSFORM_DEGREE = {
    LEFT: '0deg',
    DOWN: '90deg',
    RIGHT: '180deg',
    UP: '270deg',
};

export const ArrowIcon: FC<IProps> = ({ width, height, color, position = 'LEFT' }) => {
    return (
        <View style={{ transform: [{ rotate: TRANSFORM_DEGREE[position] }], width: width || 24, height: height || 24 }}>
            <Svg width={width || 24} height={height || 24} fill="none" viewBox="0 0 24 24">
                <Path
                    d="m15.5 19-7-7 7-7"
                    stroke={color || '#000000'}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
};
