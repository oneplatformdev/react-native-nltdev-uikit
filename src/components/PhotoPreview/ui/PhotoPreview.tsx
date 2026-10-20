import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from '@d11/react-native-fast-image';
import { Loader } from '../../Loader';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { useFullscreenImage, usePhotoPreview } from '../presenters/usePhotoPreview';
import { fastImageStyles, getFullscreenStyles, getStyles } from './styles';
import type { PhotoPreviewProps } from '../types/types';

type FullscreenImageProps = Pick<PhotoPreviewProps, 'source' | 'fullscreenResizeMode' | 'fullscreenImageStyle' | 'loadingIndicator'>
    & { styles: ReturnType<typeof getFullscreenStyles>['styles'] };

const FullscreenImage = ({ source, fullscreenResizeMode, fullscreenImageStyle, loadingIndicator, styles }: FullscreenImageProps) => {
    const { isLoading, isImageVisible, onLoadStart, onLoad, onError } = useFullscreenImage();
    const hasSource = typeof source === 'number' || Boolean(source.uri?.trim());

    return (
        <View style={styles.imageArea}>
            {hasSource ? (
                <FastImage
                    source={source}
                    resizeMode={fullscreenResizeMode ?? FastImage.resizeMode.contain}
                    accessible={false}
                    style={[fastImageStyles.fill, fullscreenImageStyle, !isImageVisible && fastImageStyles.hidden]}
                    onLoadStart={onLoadStart}
                    onLoad={onLoad}
                    onError={onError}
                />
            ) : null}
            {hasSource && isLoading ? (
                <View pointerEvents="none" style={styles.loadingOverlay}>
                    {loadingIndicator === undefined ? <Loader inline transparent accessibilityLabel="Loading photo" /> : loadingIndicator}
                </View>
            ) : null}
        </View>
    );
};

type FullscreenViewerProps = Pick<PhotoPreviewProps,
    | 'source' | 'fullscreenResizeMode' | 'fullscreenBackgroundColor' | 'fullscreenImageStyle'
    | 'closeIcon' | 'closeAccessibilityLabel' | 'closeAccessibilityHint' | 'loadingIndicator'>
    & { visible: boolean; onClose: () => void };

const FullscreenViewer = ({
    source,
    visible,
    onClose,
    fullscreenResizeMode,
    fullscreenBackgroundColor,
    fullscreenImageStyle,
    closeIcon,
    closeAccessibilityLabel,
    closeAccessibilityHint,
    loadingIndicator,
}: FullscreenViewerProps) => {
    const { colors, spacing } = useUITheme();
    const scaling = useScaling();
    const { top } = useSafeAreaInsets();
    const { styles, closeHitSlop } = useMemo(
        () => getFullscreenStyles(colors, spacing, scaling, top, fullscreenBackgroundColor),
        [colors, spacing, scaling, top, fullscreenBackgroundColor],
    );
    const sourceKey = typeof source === 'number' ? `asset:${source}` : JSON.stringify(source);

    return (
        <Modal visible={visible} animationType="none" statusBarTranslucent onRequestClose={onClose}>
            <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.fullscreen} accessibilityViewIsModal>
                <View style={styles.toolbar}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={closeAccessibilityLabel ?? 'Close photo'}
                        accessibilityHint={closeAccessibilityHint}
                        hitSlop={closeHitSlop}
                        onPress={onClose}
                        style={styles.close}
                    >
                        {closeIcon === undefined ? <Text style={styles.closeText}>×</Text>
                            : typeof closeIcon === 'string' || typeof closeIcon === 'number'
                                ? <Text style={styles.closeText}>{closeIcon}</Text> : closeIcon}
                    </Pressable>
                </View>
                {visible ? (
                    <FullscreenImage
                        key={sourceKey}
                        source={source}
                        fullscreenResizeMode={fullscreenResizeMode}
                        fullscreenImageStyle={fullscreenImageStyle}
                        loadingIndicator={loadingIndicator}
                        styles={styles}
                    />
                ) : null}
            </SafeAreaView>
        </Modal>
    );
};

export const PhotoPreview = ({
    source,
    width,
    height,
    aspectRatio,
    borderRadius,
    resizeMode = FastImage.resizeMode.cover,
    fullscreen = false,
    fullscreenResizeMode,
    fullscreenBackgroundColor,
    fullscreenImageStyle,
    closeIcon,
    closeAccessibilityLabel,
    closeAccessibilityHint,
    loadingIndicator,
    onFullscreenOpen,
    onFullscreenClose,
    overlay,
    removeIcon,
    onRemovePress,
    removeAccessibilityLabel,
    removeAccessibilityHint,
    onPress,
    accessibilityLabel,
    accessibilityHint,
    disabled = false,
    style,
    imageStyle,
}: PhotoPreviewProps) => {
    const { colors, radius, spacing } = useUITheme();
    const scaling = useScaling();
    const { styles, removeHitSlop } = useMemo(
        () => getStyles(colors, radius, spacing, scaling, width, height, aspectRatio, borderRadius),
        [colors, radius, spacing, scaling, width, height, aspectRatio, borderRadius],
    );
    const { visible, onThumbnailPress, onClose } = usePhotoPreview({
        fullscreen, disabled, onPress, onFullscreenOpen, onFullscreenClose,
    });
    const isPressable = fullscreen || onPress !== undefined;
    const image = (
        <View style={styles.image}>
            <FastImage
                source={source}
                resizeMode={resizeMode}
                accessible={!isPressable}
                accessibilityRole={isPressable ? undefined : 'image'}
                accessibilityLabel={isPressable ? undefined : accessibilityLabel}
                accessibilityHint={isPressable ? undefined : accessibilityHint}
                style={[fastImageStyles.fill, imageStyle]}
            />
        </View>
    );

    return (
        <View style={[styles.container, style]}>
            {isPressable ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={accessibilityLabel ?? 'Open photo'}
                    accessibilityHint={accessibilityHint}
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    onPress={onThumbnailPress}
                    style={StyleSheet.absoluteFill}
                >
                    {image}
                </Pressable>
            ) : image}
            {overlay != null && overlay !== false ? (
                <View pointerEvents={disabled ? 'none' : 'box-none'} style={styles.overlay}>
                    {typeof overlay === 'string' || typeof overlay === 'number' ? <Text>{overlay}</Text> : overlay}
                </View>
            ) : null}
            {onRemovePress ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={removeAccessibilityLabel ?? 'Remove photo'}
                    accessibilityHint={removeAccessibilityHint}
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    hitSlop={removeHitSlop}
                    onPress={onRemovePress}
                    style={styles.remove}
                >
                    {removeIcon === undefined ? <Text style={styles.removeText}>×</Text>
                        : typeof removeIcon === 'string' || typeof removeIcon === 'number'
                            ? <Text style={styles.removeText}>{removeIcon}</Text> : removeIcon}
                </Pressable>
            ) : null}
            {fullscreen ? (
                <FullscreenViewer
                    source={source}
                    visible={visible}
                    onClose={onClose}
                    fullscreenResizeMode={fullscreenResizeMode}
                    fullscreenBackgroundColor={fullscreenBackgroundColor}
                    fullscreenImageStyle={fullscreenImageStyle}
                    closeIcon={closeIcon}
                    closeAccessibilityLabel={closeAccessibilityLabel}
                    closeAccessibilityHint={closeAccessibilityHint}
                    loadingIndicator={loadingIndicator}
                />
            ) : null}
        </View>
    );
};
