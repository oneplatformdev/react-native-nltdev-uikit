import type { ReactNode } from 'react';
import type { ThemeMode, UIThemeOverride } from '../theme/types';

export type MaybePromise<T> = T | Promise<T>;

export type ChangeMode = (mode: ThemeMode) => MaybePromise<void>;

export interface UIModeContextValue {
    mode: ThemeMode;
    changeMode?: ChangeMode;
}

export type TranslationParams = Readonly<Record<string, unknown>>;

export type Translate = (key: string, params?: TranslationParams) => string;

export type ChangeLocale = (locale: string) => MaybePromise<void>;

export interface UILocalizationAdapter {
    locale: string;
    t: Translate;
    changeLocale?: ChangeLocale;
    direction?: 'ltr' | 'rtl';
}

export interface UIProviderProps {
    children: ReactNode;
    theme?: UIThemeOverride;
    onModeChange?: ChangeMode;
    localization?: UILocalizationAdapter;
}
