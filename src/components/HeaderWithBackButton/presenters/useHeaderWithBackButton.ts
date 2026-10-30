import { useState } from 'react';
import type { HeaderWithBackButtonProps } from '../types/types';

export const useHeaderWithBackButton = (
    titleAlign: HeaderWithBackButtonProps['titleAlign'],
    backVisible: boolean,
) => {
    const [measuredLeftWidth, setLeftWidth] = useState<number>();
    const [rightWidth, setRightWidth] = useState<number>();
    const centered = titleAlign === 'center';
    const availableCentered = titleAlign === 'available-center';
    const leftWidth = backVisible ? measuredLeftWidth : 0;
    const sideWidth = Math.max(leftWidth ?? 0, rightWidth ?? 0);

    return {
        availableCentered,
        centered,
        leftWidth,
        rightWidth,
        setLeftWidth,
        setRightWidth,
        sideWidth,
        leftGuard: sideWidth - (leftWidth ?? 0),
        rightGuard: sideWidth - (rightWidth ?? 0),
    };
};
