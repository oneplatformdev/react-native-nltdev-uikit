import { Dimensions, PixelRatio, Platform } from 'react-native';

const idealWidth: number = 375;
const idealHeight: number = 812;
export const size: { width: number; height: number } = Dimensions.get('window');
const ratio: number = PixelRatio.getFontScale();

export const scaleHorizontal = (inWidth: number = 1): number => {
    const delimiter: number = idealWidth / inWidth;
    return size.width / delimiter;
};

export const scaleVertical = (inHeight: number = 1) => {
    const delimiter: number = idealHeight / inHeight;
    return size.height / delimiter;
};

export const scaleFontSize = (fontSize: number = 1): number => {
    const divisionRatio: number = idealWidth / (fontSize / ratio);
    return size.width / divisionRatio;
};

export const scaleLineHeight = (lineHeight: number = 1): number => {
    const divisionRatio = idealHeight / (lineHeight / ratio);
    let result = size.height / divisionRatio;

    // Корректировка для маленьких экранов (например, <700px высоты)
    if (size.height < 700) {
        result += 4;
    }

    return result;
};