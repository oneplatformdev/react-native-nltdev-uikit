import React, { createContext, useContext, ReactNode } from 'react';
import { defaultLightTheme } from './defaultTheme';
import { UIKitTheme } from './types';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const ThemeContext = createContext<UIKitTheme>(defaultLightTheme);

type Props = {
  theme?: DeepPartial<UIKitTheme>;
  children: ReactNode;
};

export const UIKitThemeProvider = ({ theme, children }: Props) => {
  const mergedTheme: UIKitTheme = {
    ...defaultLightTheme,
    colors: {
      ...defaultLightTheme.colors,
      ...theme?.colors,
    },
  };

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useUIKitTheme = () => useContext(ThemeContext);