import React, { forwardRef, memo } from 'react';
import { Text } from 'react-native';
import type { TextInstance } from 'react-native';
import { useTypography } from './useTypography';
import type { TypographyProps } from './types';

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
        const resolvedStyle = useTypography({ variant, weight, color, size, lineHeight });

        return <Text ref={ref} {...props} style={[resolvedStyle, style]}>{text ?? children}</Text>;
    },
);

TypographyComponent.displayName = 'Typography';

export const Typography = memo(TypographyComponent);
