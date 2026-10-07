import { createContext, useContext } from 'react';
import { defaultTheme } from '../theme/defaultTheme';
import type { UIModeContextValue } from './types';

export const UIModeContext = createContext<UIModeContextValue>({
    mode: defaultTheme.mode,
});

export const useUIMode = (): UIModeContextValue => useContext(UIModeContext);
