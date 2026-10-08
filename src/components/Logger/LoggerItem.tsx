import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { UIColors } from '../../theme';
import { Typography } from '../Typography';
import type { LoggerPresentationItem } from './groupLoggerEntries';
import {
    getCopyableText,
    getExpandablePayload,
    getLoggerSectionContext,
    getRequestParams,
    getResponseDurationSuffix,
    getResponseSummary,
    getStatusColorKey,
    getVisibleSectionText,
    shouldRenderLoggerSection,
} from './loggerPresentation';
import type { LoggerEntry, LoggerLabels, LoggerProps } from './types';
import type { getStyles } from './styles';

interface LoggerItemProps {
    item: LoggerPresentationItem;
    labels: LoggerLabels;
    colors: UIColors;
    styles: ReturnType<typeof getStyles>;
    expandedEntryIds: ReadonlySet<string>;
    onToggleEntry: (id: string) => void;
    onCopyEntry: LoggerProps['onCopyEntry'];
    copyIcon: LoggerProps['copyIcon'];
}

const sectionColor = (entry: LoggerEntry, colors: UIColors): string => {
    if (entry.type === 'error' || (entry.http?.status !== undefined && entry.http.status >= 400)) return colors.error;
    if (entry.type === 'warning') return colors.warning;
    if (entry.http?.phase === 'response' || entry.type === 'response') return colors.success;
    if (entry.http?.phase === 'request' || entry.type === 'request') return colors.primary;
    return colors.icon;
};

export const LoggerItem = ({ item, labels, colors, styles, expandedEntryIds, onToggleEntry, onCopyEntry, copyIcon }: LoggerItemProps) => {
    const entries = item.kind === 'exchange'
        ? [item.request, item.response].filter((entry): entry is LoggerEntry => entry !== undefined && shouldRenderLoggerSection(entry, labels))
        : shouldRenderLoggerSection(item.entry, labels) ? [item.entry] : [];
    const name = item.kind === 'exchange' ? item.request?.name ?? item.response?.name : item.entry.name;

    return (
        <View style={styles.card}>
            <Typography text={name ?? ''} variant="label" weight="bold" style={styles.cardTitle} />
            {entries.map((entry, index) => {
                const expanded = expandedEntryIds.has(entry.id);
                const payload = getExpandablePayload(entry, labels);
                const hasPayload = payload !== undefined;
                const requestParams = getRequestParams(entry, labels);
                const copyText = onCopyEntry ? getCopyableText(entry, labels) : undefined;
                const context = getLoggerSectionContext(entry, labels);
                const summary = getResponseSummary(entry, labels);
                const visibleText = getVisibleSectionText(entry, labels);
                const accessibilityLabel = `${context} ${entry.name}${summary ? ` ${summary}` : ''}`;
                const status = entry.http?.phase === 'response' ? entry.http.status : undefined;
                const visibleLabel = visibleText ? status === undefined ? (
                    <Typography text={visibleText} variant="caption" weight="medium" style={styles.sectionTitle} />
                ) : (
                    <Typography variant="caption" weight="medium" style={styles.sectionTitle}>
                        {`${labels.status}: `}
                        <Text style={{ color: colors[getStatusColorKey(status)] }}>{status}</Text>
                        {getResponseDurationSuffix(entry)}
                    </Typography>
                ) : <View style={styles.sectionTitle} />;
                const copyButton = onCopyEntry && copyText !== undefined ? (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`${labels.copy} ${accessibilityLabel}`}
                        onPress={() => { onCopyEntry(entry, copyText); }}
                        style={requestParams ? styles.copyButtonTop : styles.copyButton}
                    >
                        {copyIcon ?? <Typography text={labels.copy} variant="caption" />}
                    </TouchableOpacity>
                ) : null;
                const showRow = hasPayload || !!visibleText || (!requestParams && copyButton !== null);
                return (
                    <React.Fragment key={entry.id}>
                        {index > 0 ? <View style={styles.divider} /> : null}
                        <View style={[styles.section, { borderLeftColor: sectionColor(entry, colors) }]}>
                            {requestParams ? (
                                <View style={styles.paramsRow}>
                                    <Typography text={requestParams} variant="caption" selectable style={[styles.message, styles.paramsText]} />
                                    {copyButton}
                                </View>
                            ) : null}
                            {showRow ? (
                                <View style={styles.sectionRow}>
                                    {hasPayload ? (
                                        <TouchableOpacity
                                            accessibilityRole="button"
                                            accessibilityLabel={accessibilityLabel}
                                            accessibilityState={{ expanded }}
                                            onPress={() => onToggleEntry(entry.id)}
                                            style={styles.sectionButton}
                                        >
                                            {visibleLabel}
                                            <Typography text={expanded ? '−' : '+'} variant="label" />
                                        </TouchableOpacity>
                                    ) : visibleText ? (
                                        <View accessible accessibilityLabel={accessibilityLabel} style={styles.sectionButton}>
                                            {visibleLabel}
                                        </View>
                                    ) : <View style={styles.sectionTitle} />}
                                    {!requestParams ? copyButton : null}
                                </View>
                            ) : requestParams ? null : <View accessible accessibilityLabel={accessibilityLabel} style={styles.emptySection} />}
                            {expanded && hasPayload ? <Typography text={payload} variant="body" selectable style={styles.message} /> : null}
                        </View>
                    </React.Fragment>
                );
            })}
        </View>
    );
};
