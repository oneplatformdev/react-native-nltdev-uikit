import { StyleSheet } from 'react-native';
import type { UIColors, UIRadius } from '../../../theme';
import type { ScalingFunctions } from '../../../utils';
import type { CheckboxProps } from '../types/types';

type CheckboxVisualProps = Pick<CheckboxProps,
    | 'size' | 'shape' | 'borderRadius' | 'borderWidth' | 'checkedBackgroundColor' | 'uncheckedBackgroundColor'
    | 'checkedBorderColor' | 'uncheckedBorderColor' | 'disabledBackgroundColor' | 'disabledBorderColor'
    | 'iconSize' | 'iconColor'>;

const positiveOr = (value: number | undefined, fallback: number) =>
    value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;

export const getStyles = (
    colors: UIColors,
    radius: UIRadius,
    scaling: ScalingFunctions,
    checked: boolean,
    disabled: boolean,
    props: CheckboxVisualProps,
) => {
    const designSize = positiveOr(props.size, 22);
    const designBorderWidth = Math.min(
        props.borderWidth !== undefined && Number.isFinite(props.borderWidth) ? Math.max(0, props.borderWidth) : 2,
        designSize / 4,
    );
    const designIconSize = Math.min(positiveOr(props.iconSize, 12), designSize - 2 * designBorderWidth);
    const designRadius = props.borderRadius !== undefined && Number.isFinite(props.borderRadius)
        ? Math.max(0, props.borderRadius) : radius.sm;
    const size = scaling.scaleHorizontal(designSize);
    const borderWidth = scaling.scaleHorizontal(designBorderWidth);
    const iconSize = scaling.scaleHorizontal(designIconSize);
    const backgroundColor = disabled
        ? props.disabledBackgroundColor ?? colors.disabled
        : checked ? props.checkedBackgroundColor ?? colors.primary : props.uncheckedBackgroundColor ?? colors.background;
    const borderColor = disabled
        ? props.disabledBorderColor ?? colors.disabled
        : checked ? props.checkedBorderColor ?? colors.primary : props.uncheckedBorderColor ?? colors.border;
    const indicatorColor = props.iconColor ?? (disabled ? colors.onDisabled : colors.onPrimary);

    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderWidth,
            borderRadius: props.shape === 'circle'
                ? size / 2
                : scaling.scaleHorizontal(designRadius),
            backgroundColor,
            borderColor,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        indicator: {
            width: iconSize * 0.55,
            height: iconSize * 0.8,
            borderRightWidth: scaling.scaleHorizontal(Math.min(2, designIconSize / 4)),
            borderBottomWidth: scaling.scaleHorizontal(Math.min(2, designIconSize / 4)),
            borderColor: indicatorColor,
            transform: [{ rotate: '45deg' }],
        },
    });
    const hitSlop = scaling.scaleHorizontal(Math.max(11, (44 - designSize) / 2));

    return { styles, hitSlop };
};
