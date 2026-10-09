import React, { useMemo } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useUITheme } from '../../../theme';
import { useScaling } from '../../../utils';
import { Typography } from '../../Typography';
import { LoggerItem } from './components/LoggerItem';
import { getStyles } from './styles';
import { useLogger } from '../presenters/useLogger';
import type { LoggerPresentationItem } from '../utils/groupLoggerEntries';
import type { LoggerProps } from '../types/types';

export const Logger = ({ logs, visible, onClose, onOpen, onClear, onCopyEntry, labels, openIcon, copyIcon, style }: LoggerProps) => {
    const { colors, spacing, radius } = useUITheme();
    const scaling = useScaling();
    const styles = useMemo(() => getStyles(colors, spacing, radius, scaling), [colors, spacing, radius, scaling]);
    const { items, expandedEntryIds, onToggleEntry } = useLogger(logs);

    return (
        <>
            {onOpen ? (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={labels.title}
                    onPress={onOpen}
                    style={styles.launcher}
                >
                    {openIcon ?? <Typography text={labels.title} variant="label" />}
                </TouchableOpacity>
            ) : null}

            <Modal visible={visible} onRequestClose={onClose} animationType="slide">
                <SafeAreaProvider>
                    <SafeAreaView style={[styles.container, style]}>
                        <View style={styles.header}>
                            <Typography text={labels.title} variant="title" style={styles.headerTitle} />
                            {onClear ? (
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel={labels.clear}
                                    onPress={onClear}
                                    style={styles.headerAction}
                                >
                                    <Typography text={labels.clear} variant="label" style={styles.actionText} />
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityLabel={labels.close}
                                onPress={onClose}
                                style={styles.headerAction}
                            >
                                <Typography text={labels.close} variant="label" style={styles.actionText} />
                            </TouchableOpacity>
                        </View>

                        <FlatList<LoggerPresentationItem>
                            data={items}
                            keyExtractor={item => item.key}
                            renderItem={({ item }) => (
                                <LoggerItem
                                    item={item}
                                    labels={labels}
                                    colors={colors}
                                    styles={styles}
                                    expandedEntryIds={expandedEntryIds}
                                    onToggleEntry={onToggleEntry}
                                    onCopyEntry={onCopyEntry}
                                    copyIcon={copyIcon}
                                />
                            )}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.empty}>
                                    <Typography text={labels.empty} variant="body" color="textMuted" />
                                </View>
                            }
                        />
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        </>
    );
};
