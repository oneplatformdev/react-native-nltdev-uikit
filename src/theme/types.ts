import type { TextStyle } from 'react-native';
import type { ButtonSize, ButtonVariant } from '../components/Button/types';

export type ThemeMode = 'light' | 'dark';

/** Add project color tokens through module augmentation. */
export interface UIColorsExtension {}

/** Add project font tokens through module augmentation. */
export interface UIFontsExtension {}

/** Add project spacing tokens through module augmentation. */
export interface UISpacingExtension {}

/** Add project radius tokens through module augmentation. */
export interface UIRadiusExtension {}

/** Add project typography tokens through module augmentation. */
export interface UITypographyExtension {}

type ValidatedExtensions<TExtensions, TValue> = {
    [K in keyof TExtensions]: TExtensions[K] extends TValue ? TExtensions[K] : never;
};

export type DefaultUIColors = {
    primary: string;
    onPrimary: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    disabled: string;
    onDisabled: string;
    icon: string;
    error: string;
    success: string;
    warning: string;
    transparent: string;

    /** @deprecated Use surface. */
    card: string;
    /** @deprecated Use textMuted. */
    text_light: string;
    /** @deprecated Use onPrimary. */
    text_inverted: string;
    /** @deprecated Use primary. */
    activeButtonBackground: string;
    /** @deprecated Use disabled. */
    inactiveButtonBackground: string;
    /** @deprecated Use onPrimary. */
    activeButtonText: string;
    /** @deprecated Use onDisabled. */
    inactiveButtonText: string;
};

type ExtendedUIColors = ValidatedExtensions<UIColorsExtension, string>;

export type UIColors = DefaultUIColors & ExtendedUIColors;

export type UIColorKey = keyof UIColors;

export type UIFontToken = Pick<TextStyle, 'fontFamily' | 'fontStyle' | 'fontWeight'>;

export type DefaultUIFonts = {
    regular: UIFontToken;
    medium: UIFontToken;
    semiBold: UIFontToken;
    bold: UIFontToken;
};

type ExtendedUIFonts = ValidatedExtensions<UIFontsExtension, UIFontToken>;

export type UIFonts = DefaultUIFonts & ExtendedUIFonts;

export type UIFontKey = keyof UIFonts;

export type DefaultUISpacing = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
};

type ExtendedUISpacing = ValidatedExtensions<UISpacingExtension, number>;

export type UISpacing = DefaultUISpacing & ExtendedUISpacing;

export type DefaultUIRadius = {
    sm: number;
    md: number;
    lg: number;
    full: number;
};

type ExtendedUIRadius = ValidatedExtensions<UIRadiusExtension, number>;

export type UIRadius = DefaultUIRadius & ExtendedUIRadius;

export type UITypographyToken = {
    font: UIFontKey;
    fontSize: number;
    lineHeight?: number;
    letterSpacing?: number;
    includeFontPadding?: TextStyle['includeFontPadding'];
    flexShrink?: TextStyle['flexShrink'];
};

export type DefaultTypographyVariant =
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'title'
    | 'body'
    | 'label'
    | 'caption';

export type DefaultUITypography = Record<DefaultTypographyVariant, UITypographyToken>;

type ExtendedUITypography = ValidatedExtensions<UITypographyExtension, UITypographyToken>;

export type UITypography = DefaultUITypography & ExtendedUITypography;

export type TypographyVariant = keyof UITypography;

export type UIButtonVariantTheme = {
    background: UIColorKey;
    foreground: UIColorKey;
    border: UIColorKey;
    disabledBackground: UIColorKey;
    disabledForeground: UIColorKey;
    disabledBorder: UIColorKey;
    borderWidth?: number;
};

export type UIButtonSizeTheme = {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    radius: number;
    borderWidth: number;
    gap: number;
    labelVariant: TypographyVariant;
    labelWeight: UIFontKey;
};

export type UIButtonTheme = {
    variants: Record<ButtonVariant, UIButtonVariantTheme>;
    sizes: Record<ButtonSize, UIButtonSizeTheme>;
    numberOfLines?: number;
};

export type UIButtonThemeOverride = {
    variants?: { [K in ButtonVariant]?: Partial<UIButtonVariantTheme> };
    sizes?: { [K in ButtonSize]?: Partial<UIButtonSizeTheme> };
    numberOfLines?: number;
};

export interface UIInputTheme {
    colors: {
        background: UIColorKey;
        border: UIColorKey;
        focusedBorder: UIColorKey;
        errorBorder: UIColorKey;
        disabledBackground: UIColorKey;
        disabledBorder: UIColorKey;
        text: UIColorKey;
        disabledText: UIColorKey;
        placeholder: UIColorKey;
        label: UIColorKey;
        helper: UIColorKey;
        error: UIColorKey;
    };
    geometry: {
        marginBottom: number;
        minHeight: number;
        textMinHeight: number;
        paddingHorizontal: number;
        borderWidth: number;
        radius: number;
        labelGap: number;
        supportingGap: number;
        startAccessoryGap: number;
        endAccessoryGap: number;
        passwordToggleGap: number;
        multilinePaddingVertical: number;
    };
    typography: {
        inputFont: UIFontKey;
        inputFontSize: number;
        includeFontPadding: boolean;
        labelVariant: TypographyVariant;
        helperVariant: TypographyVariant;
        errorVariant: TypographyVariant;
    };
}

export type UIInputThemeOverride = {
    colors?: Partial<UIInputTheme['colors']>;
    geometry?: Partial<UIInputTheme['geometry']>;
    typography?: Partial<UIInputTheme['typography']>;
};

export type DefaultUITheme = {
    mode: ThemeMode;
    colors: DefaultUIColors;
    fonts: DefaultUIFonts;
    spacing: DefaultUISpacing;
    radius: DefaultUIRadius;
    typography: DefaultUITypography;
    button: UIButtonTheme;
    input: UIInputTheme;
};

export type UITheme = {
    mode: ThemeMode;
    colors: UIColors;
    fonts: UIFonts;
    spacing: UISpacing;
    radius: UIRadius;
    typography: UITypography;
    button: UIButtonTheme;
    input: UIInputTheme;
};

type NestedTokenOverrides<TTokens> = {
    [K in keyof TTokens]?: TTokens[K] extends object ? Partial<TTokens[K]> : TTokens[K];
};

export type UIThemeOverride = {
    mode?: ThemeMode;
    colors?: Partial<DefaultUIColors> & Partial<ExtendedUIColors>;
    fonts?: NestedTokenOverrides<DefaultUIFonts> & Partial<ExtendedUIFonts>;
    spacing?: Partial<DefaultUISpacing> & Partial<ExtendedUISpacing>;
    radius?: Partial<DefaultUIRadius> & Partial<ExtendedUIRadius>;
    typography?: NestedTokenOverrides<DefaultUITypography> & Partial<ExtendedUITypography>;
    button?: UIButtonThemeOverride;
    input?: UIInputThemeOverride;
};

/** @deprecated Use UIColors. */
export type UIKitColors = Pick<
    UIColors,
    | 'primary'
    | 'background'
    | 'border'
    | 'card'
    | 'text'
    | 'text_inverted'
    | 'activeButtonBackground'
    | 'inactiveButtonBackground'
    | 'activeButtonText'
    | 'inactiveButtonText'
    | 'icon'
    | 'error'
>;

/** @deprecated Use UITheme. */
export type UIKitTheme = {
    mode: ThemeMode;
    colors: UIKitColors;
};
