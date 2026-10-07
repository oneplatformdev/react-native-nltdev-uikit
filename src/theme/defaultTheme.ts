import type { DefaultUIRadius, DefaultUISpacing, DefaultUITheme, UIButtonTheme, UIInputTheme } from './types';

const defaultSpacing: DefaultUISpacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
};

const defaultRadius: DefaultUIRadius = {
    sm: 6,
    md: 10,
    lg: 16,
    full: 999,
};

export const createDefaultButtonTheme = (
    spacing: DefaultUISpacing,
    radius: DefaultUIRadius,
): UIButtonTheme => ({
    variants: {
        primary: {
            background: 'primary',
            foreground: 'onPrimary',
            border: 'primary',
            disabledBackground: 'disabled',
            disabledForeground: 'onDisabled',
            disabledBorder: 'disabled',
        },
        secondary: {
            background: 'surface',
            foreground: 'text',
            border: 'transparent',
            disabledBackground: 'disabled',
            disabledForeground: 'onDisabled',
            disabledBorder: 'disabled',
        },
        outline: {
            background: 'transparent',
            foreground: 'primary',
            border: 'primary',
            disabledBackground: 'disabled',
            disabledForeground: 'onDisabled',
            disabledBorder: 'disabled',
        },
        ghost: {
            background: 'transparent',
            foreground: 'primary',
            border: 'transparent',
            disabledBackground: 'disabled',
            disabledForeground: 'onDisabled',
            disabledBorder: 'disabled',
            borderWidth: 0,
        },
    },
    sizes: {
        sm: {
            minHeight: spacing.xxl,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            radius: radius.sm,
            borderWidth: 1,
            gap: spacing.xs,
            labelVariant: 'label',
            labelWeight: 'semiBold',
        },
        md: {
            minHeight: spacing.xxl + spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            radius: radius.md,
            borderWidth: 1,
            gap: spacing.sm,
            labelVariant: 'label',
            labelWeight: 'semiBold',
        },
        lg: {
            minHeight: spacing.xxl + spacing.xl,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            radius: radius.lg,
            borderWidth: 1,
            gap: spacing.md,
            labelVariant: 'body',
            labelWeight: 'semiBold',
        },
    },
});

export const createDefaultInputTheme = (
    spacing: DefaultUISpacing,
    radius: DefaultUIRadius,
): UIInputTheme => ({
    colors: {
        background: 'background',
        border: 'border',
        focusedBorder: 'primary',
        errorBorder: 'error',
        disabledBackground: 'disabled',
        disabledBorder: 'disabled',
        text: 'text',
        disabledText: 'onDisabled',
        placeholder: 'textMuted',
        label: 'textMuted',
        helper: 'textMuted',
        error: 'error',
    },
    geometry: {
        marginBottom: 0,
        minHeight: 48,
        textMinHeight: 46,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        radius: radius.md,
        labelGap: spacing.xs,
        supportingGap: spacing.xs,
        startAccessoryGap: spacing.sm,
        endAccessoryGap: 0,
        passwordToggleGap: spacing.sm,
        multilinePaddingVertical: spacing.sm,
    },
    typography: {
        inputFont: 'medium',
        inputFontSize: 14,
        includeFontPadding: false,
        labelVariant: 'caption',
        helperVariant: 'caption',
        errorVariant: 'caption',
    },
});

export const defaultTheme: DefaultUITheme = {
    mode: 'light',
    colors: {
        primary: '#9CCC8B',
        onPrimary: '#FFFFFF',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        border: '#D1D1D6',
        text: '#111827',
        textMuted: '#6B7280',
        disabled: '#E5E7EB',
        onDisabled: '#6B7280',
        icon: '#6B7280',
        error: '#D92D20',
        success: '#15803D',
        warning: '#B45309',
        transparent: 'transparent',

        card: '#BAC2BF',
        text_light: '#6B7280',
        text_inverted: '#FFFFFF',
        activeButtonBackground: '#9CCC8B',
        inactiveButtonBackground: '#E5E7EB',
        activeButtonText: '#FFFFFF',
        inactiveButtonText: '#6B7280',
    },
    fonts: {
        regular: { fontWeight: '400' },
        medium: { fontWeight: '500' },
        semiBold: { fontWeight: '600' },
        bold: { fontWeight: '700' },
    },
    spacing: defaultSpacing,
    radius: defaultRadius,
    typography: {
        display: {
            font: 'bold',
            fontSize: 32,
            lineHeight: 40,
        },
        h1: {
            font: 'bold',
            fontSize: 28,
            lineHeight: 36,
        },
        h2: {
            font: 'bold',
            fontSize: 24,
            lineHeight: 32,
        },
        h3: {
            font: 'semiBold',
            fontSize: 20,
            lineHeight: 28,
        },
        title: {
            font: 'semiBold',
            fontSize: 18,
            lineHeight: 24,
        },
        body: {
            font: 'regular',
            fontSize: 16,
            lineHeight: 24,
        },
        label: {
            font: 'medium',
            fontSize: 14,
            lineHeight: 20,
        },
        caption: {
            font: 'regular',
            fontSize: 12,
            lineHeight: 16,
        },
    },
    button: createDefaultButtonTheme(defaultSpacing, defaultRadius),
    input: createDefaultInputTheme(defaultSpacing, defaultRadius),
};

/** @deprecated Use defaultTheme. */
export const defaultLightTheme = defaultTheme;
