import { createDefaultButtonTheme, createDefaultInputTheme, defaultTheme } from './defaultTheme';
import type { UITheme, UIThemeOverride } from './types';

const isTokenObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const mergeNestedTokens = (defaults: object, overrides: object | undefined): object => {
    const defaultTokens = defaults as Record<string, unknown>;
    const overrideTokens = (overrides ?? {}) as Record<string, unknown>;
    const result: Record<string, unknown> = { ...defaultTokens };

    Object.keys(overrideTokens).forEach(key => {
        const defaultToken = defaultTokens[key];
        const overrideToken = overrideTokens[key];

        result[key] =
            isTokenObject(defaultToken) && isTokenObject(overrideToken)
                ? { ...defaultToken, ...overrideToken }
                : overrideToken;
    });

    return result;
};

export const createTheme = (overrides: UIThemeOverride = {}): UITheme => {
    const spacing = { ...defaultTheme.spacing, ...overrides.spacing };
    const radius = { ...defaultTheme.radius, ...overrides.radius };
    const buttonDefaults = createDefaultButtonTheme(spacing, radius);
    const buttonOverrides = overrides.button;
    const inputDefaults = createDefaultInputTheme(spacing, radius);
    const theme = {
        mode: overrides.mode ?? defaultTheme.mode,
        colors: {
            ...defaultTheme.colors,
            ...overrides.colors,
        },
        fonts: mergeNestedTokens(defaultTheme.fonts, overrides.fonts),
        spacing,
        radius,
        typography: mergeNestedTokens(defaultTheme.typography, overrides.typography),
        button: {
            variants: {
                primary: { ...buttonDefaults.variants.primary, ...buttonOverrides?.variants?.primary },
                secondary: { ...buttonDefaults.variants.secondary, ...buttonOverrides?.variants?.secondary },
                outline: { ...buttonDefaults.variants.outline, ...buttonOverrides?.variants?.outline },
                ghost: { ...buttonDefaults.variants.ghost, ...buttonOverrides?.variants?.ghost },
            },
            sizes: {
                sm: { ...buttonDefaults.sizes.sm, ...buttonOverrides?.sizes?.sm },
                md: { ...buttonDefaults.sizes.md, ...buttonOverrides?.sizes?.md },
                lg: { ...buttonDefaults.sizes.lg, ...buttonOverrides?.sizes?.lg },
            },
            numberOfLines: buttonOverrides?.numberOfLines,
        },
        input: {
            colors: { ...inputDefaults.colors, ...overrides.input?.colors },
            geometry: { ...inputDefaults.geometry, ...overrides.input?.geometry },
            typography: { ...inputDefaults.typography, ...overrides.input?.typography },
        },
    };

    // Augmented token keys are compile-time declarations; this assertion bridges them
    // to the dynamically merged runtime categories above.
    return theme as UITheme;
};
