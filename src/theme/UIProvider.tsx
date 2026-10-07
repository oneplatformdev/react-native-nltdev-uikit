import React, { createContext, useContext, useMemo } from 'react';
import { UILocalizationContext } from '../provider/LocalizationContext';
import { UIModeContext } from '../provider/ModeContext';
import type {
    UILocalizationAdapter,
    UIModeContextValue,
    UIProviderProps,
} from '../provider/types';
import { createTheme } from './createTheme';
import { defaultTheme } from './defaultTheme';
import type { UITheme } from './types';

const UIThemeContext = createContext<UITheme>(defaultTheme as UITheme);

export type { UIProviderProps } from '../provider/types';

export const UIProvider = ({ children, theme, onModeChange, localization }: UIProviderProps) => {
    const locale = localization?.locale;
    const translate = localization?.t;
    const changeLocale = localization?.changeLocale;
    const direction = localization?.direction;
    const value = useMemo<UITheme>(
        () => (theme ? createTheme(theme) : (defaultTheme as UITheme)),
        [theme],
    );
    const modeValue = useMemo<UIModeContextValue>(
        () => ({ mode: value.mode, changeMode: onModeChange }),
        [onModeChange, value.mode],
    );
    const localizationValue = useMemo<UILocalizationAdapter | undefined>(
        () =>
            locale !== undefined && translate !== undefined
                ? {
                    locale,
                    t: translate,
                    changeLocale,
                    direction,
                }
                : undefined,
        [changeLocale, direction, locale, translate],
    );

    return (
        <UIThemeContext.Provider value={value}>
            <UIModeContext.Provider value={modeValue}>
                <UILocalizationContext.Provider value={localizationValue}>
                    {children}
                </UILocalizationContext.Provider>
            </UIModeContext.Provider>
        </UIThemeContext.Provider>
    );
};

export const useUITheme = (): UITheme => useContext(UIThemeContext);

/** @deprecated Use UIProvider. */
export const UIKitThemeProvider = UIProvider;

/** @deprecated Use useUITheme. */
export const useUIKitTheme = useUITheme;
