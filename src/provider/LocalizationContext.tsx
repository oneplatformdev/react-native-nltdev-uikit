import { createContext, useContext } from 'react';
import type { UILocalizationAdapter } from './types';

export const UILocalizationContext = createContext<UILocalizationAdapter | undefined>(undefined);

export const useUILocalization = (): UILocalizationAdapter => {
    const localization = useContext(UILocalizationContext);

    if (!localization) {
        throw new Error('useUILocalization requires the localization prop on UIProvider.');
    }

    return localization;
};
