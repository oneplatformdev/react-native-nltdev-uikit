import { useState } from 'react';
import type { HeaderWithBackButtonProps } from '../types/types';

export const useHeaderWithBackButton = (titleAlign: HeaderWithBackButtonProps['titleAlign']) => {
    const [leftWidth, setLeftWidth] = useState<number>();
    const [rightWidth, setRightWidth] = useState<number>();
    const centered = titleAlign === 'center';

    return {
        centered,
        leftWidth,
        rightWidth,
        setLeftWidth,
        setRightWidth,
        sideWidth: Math.max(leftWidth ?? 0, rightWidth ?? 0),
    };
};
