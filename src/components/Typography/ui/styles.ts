import type { TextStyle } from 'react-native';
import type { UITheme, UITypographyToken } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';
import type { TypographyProps } from '../types/types';

type TypographyStyleProps = Pick<TypographyProps, 'variant' | 'weight' | 'color' | 'size' | 'lineHeight'>;

export const getTypographyStyle = (
    { colors, fonts, typography }: UITheme,
    scaling: ScalingFunctions,
    { variant = 'body', weight, color = 'text', size, lineHeight }: TypographyStyleProps,
): TextStyle => {
    const token = typography[variant] as UITypographyToken;
    const font = fonts[weight ?? token.font];
    const resolvedLineHeight = lineHeight ?? token.lineHeight;

    return {
        ...font,
        color: colors[color],
        fontSize: scaling.scaleFontSize(size ?? token.fontSize),
        lineHeight: resolvedLineHeight === undefined ? undefined : scaling.scaleLineHeight(resolvedLineHeight),
        letterSpacing: token.letterSpacing,
        includeFontPadding: token.includeFontPadding,
        flexShrink: token.flexShrink,
    };
};
