import { useMemo } from 'react';
import { View } from 'react-native';
import { Button } from '../../Button';
import { Typography } from '../../Typography';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { getStyles } from './styles';
import type { EmptyListViewProps } from '../types/types';

export const EmptyListView = ({
    visual,
    title,
    description,
    titleVariant = 'title',
    descriptionVariant = 'body',
    actionLabel,
    onActionPress,
    action,
    accessibilityLabel,
    style,
    contentStyle,
    visualStyle,
    titleStyle,
    descriptionStyle,
}: EmptyListViewProps) => {
    const { spacing } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(() => getStyles(spacing, scaling), [spacing, scaling]);

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.content, contentStyle]}>
                {visual != null && visual !== false ? (
                    <View
                        accessible={accessibilityLabel !== undefined}
                        accessibilityLabel={accessibilityLabel}
                        style={[styles.visual, visualStyle]}
                    >
                        {typeof visual === 'string' || typeof visual === 'number'
                            ? <Typography text={visual} /> : visual}
                    </View>
                ) : null}
                {title != null ? (
                    typeof title === 'string' || typeof title === 'number'
                        ? <Typography text={title} variant={titleVariant} style={[styles.title, titleStyle]} />
                        : title
                ) : null}
                {description != null ? (
                    typeof description === 'string' || typeof description === 'number'
                        ? <Typography text={description} variant={descriptionVariant} color="textMuted" style={[styles.description, descriptionStyle]} />
                        : description
                ) : null}
                {action != null && action !== false ? action : actionLabel && onActionPress
                    ? <Button text={actionLabel} onPress={onActionPress} /> : null}
            </View>
        </View>
    );
};
