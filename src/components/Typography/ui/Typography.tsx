import React, { forwardRef, memo, useMemo } from 'react';
import { Text } from 'react-native';
import type { TextInstance } from 'react-native';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { getTypographyStyle } from './styles';
import type { TypographyProps } from '../types/types';

const TypographyComponent = forwardRef<TextInstance, TypographyProps>(
    (
        {
            text,
            children,
            variant,
            weight,
            color,
            size,
            lineHeight,
            style,
            ...props
        },
        ref,
    ) => {
        const theme = useUITheme();
        const scaling = useScaling();
        const resolvedStyle = useMemo(
            () => getTypographyStyle(theme, scaling, { variant, weight, color, size, lineHeight }),
            [theme, scaling, variant, weight, color, size, lineHeight],
        );

        return <Text ref={ref} {...props} style={[resolvedStyle, style]}>{text ?? children}</Text>;
    },
);

TypographyComponent.displayName = 'Typography';

export const Typography = memo(TypographyComponent);
