import { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { getStyles } from './styles';
import type { CheckboxProps } from '../types/types';

export const Checkbox = ({
    checked,
    onValueChange,
    interactive = true,
    disabled = false,
    size = 22,
    shape = 'square',
    borderRadius,
    borderWidth,
    checkedBackgroundColor,
    uncheckedBackgroundColor,
    checkedBorderColor,
    uncheckedBorderColor,
    disabledBackgroundColor,
    disabledBorderColor,
    icon,
    iconSize,
    iconColor,
    accessibilityLabel,
    accessibilityHint,
    style,
}: CheckboxProps) => {
    const { colors, radius } = useUITheme();
    const scaling = useScaling();
    const { styles, hitSlop } = useMemo(() => getStyles(colors, radius, scaling, checked, disabled, {
        size,
        shape,
        borderRadius,
        borderWidth,
        checkedBackgroundColor,
        uncheckedBackgroundColor,
        checkedBorderColor,
        uncheckedBorderColor,
        disabledBackgroundColor,
        disabledBorderColor,
        iconSize,
        iconColor,
    }), [
        colors, radius, scaling, checked, disabled, size, shape, borderRadius, borderWidth,
        checkedBackgroundColor, uncheckedBackgroundColor, checkedBorderColor, uncheckedBorderColor,
        disabledBackgroundColor, disabledBorderColor, iconSize, iconColor,
    ]);
    const onPress = useCallback(() => {
        if (interactive && !disabled) onValueChange?.(!checked);
    }, [checked, disabled, interactive, onValueChange]);

    const content = checked ? (
        <View pointerEvents="none">
            {icon === undefined ? <View style={styles.indicator} />
                : typeof icon === 'string' || typeof icon === 'number' ? <Text>{icon}</Text> : icon}
        </View>
    ) : null;

    if (!interactive) {
        return (
            <View
                pointerEvents="none"
                accessible={false}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={[styles.container, style]}
            >
                {content}
            </View>
        );
    }

    return (
        <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ checked, disabled }}
            disabled={disabled}
            hitSlop={hitSlop}
            onPress={onPress}
            style={[styles.container, style]}
        >
            {content}
        </Pressable>
    );
};
