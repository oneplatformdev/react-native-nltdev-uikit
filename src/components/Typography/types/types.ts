import type { ReactNode } from 'react';
import type { TextProps } from 'react-native';
import type { UIColorKey, UIFontKey, TypographyVariant } from '../../../theme';

export type TypographyProps = Omit<TextProps, 'children'> & {
    variant?: TypographyVariant;
    weight?: UIFontKey;
    color?: UIColorKey;
    size?: number;
    lineHeight?: number;
} & (
    | { text: string | number; children?: never }
    | { text?: never; children?: ReactNode }
);
