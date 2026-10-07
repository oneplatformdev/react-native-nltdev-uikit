import { useMemo } from 'react';
import type { TextStyle } from 'react-native';
import { useUITheme } from '../../theme';
import type { UITypographyToken } from '../../theme';
import { useScaling } from '../../utils';
import type { TypographyProps } from './types';

type TypographyStyleProps = Pick<TypographyProps, 'variant' | 'weight' | 'color' | 'size' | 'lineHeight'>;

export const useTypography = ({
    variant = 'body',
    weight,
    color = 'text',
    size,
    lineHeight,
}: TypographyStyleProps): TextStyle => {
    const { colors, fonts, typography } = useUITheme();
    const scaling = useScaling();
    const token = typography[variant] as UITypographyToken;
    const font = fonts[weight ?? token.font];
    const resolvedLineHeight = lineHeight ?? token.lineHeight;

    return useMemo<TextStyle>(
        () => ({
            ...font,
            color: colors[color],
            fontSize: scaling.scaleFontSize(size ?? token.fontSize),
            lineHeight:
                resolvedLineHeight === undefined
                    ? undefined
                    : scaling.scaleLineHeight(resolvedLineHeight),
            letterSpacing: token.letterSpacing,
            includeFontPadding: token.includeFontPadding,
            flexShrink: token.flexShrink,
        }),
        [color, colors, font, resolvedLineHeight, scaling, size, token],
    );
};
