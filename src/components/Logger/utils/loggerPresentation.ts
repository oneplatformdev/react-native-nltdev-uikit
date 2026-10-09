import type { LoggerEntry, LoggerLabels } from '../types/types';
import type { UIColorKey } from '../../../theme';

const nonBlank = (value: string | undefined): string | undefined => value?.trim() ? value : undefined;

const isRequest = (entry: LoggerEntry): boolean => entry.http?.phase === 'request' || entry.type === 'request';

export const getLoggerSectionContext = (entry: LoggerEntry, labels: LoggerLabels): string => {
    const phase = entry.http?.phase ?? (entry.type === 'request' || entry.type === 'response' ? entry.type : undefined);
    return phase === 'request' ? labels.request : phase === 'response' ? labels.response : labels.typeLabels?.[entry.type] ?? entry.type;
};

export const getLoggerPayload = (entry: LoggerEntry): string | undefined => {
    const message = entry.message.trim();
    if (!message || (entry.http && (message === 'undefined' || message === 'null'))) return undefined;
    return entry.message;
};

export const getRequestParams = (entry: LoggerEntry, labels: LoggerLabels): string | undefined => {
    if (!isRequest(entry)) return undefined;
    const params = nonBlank(entry.requestData?.params);
    if (!params) return undefined;
    return nonBlank(entry.requestData?.body) ? `${labels.params}\n${params}` : params;
};

export const getExpandablePayload = (entry: LoggerEntry, labels: LoggerLabels): string | undefined => {
    if (!isRequest(entry)) return getLoggerPayload(entry);
    const body = nonBlank(entry.requestData?.body) ?? getLoggerPayload(entry);
    if (!body) return undefined;
    return nonBlank(entry.requestData?.params) ? `${labels.body}\n${body}` : body;
};

export const getCopyableText = (entry: LoggerEntry, labels: LoggerLabels): string | undefined => {
    if (!isRequest(entry)) return getLoggerPayload(entry);
    const params = nonBlank(entry.requestData?.params);
    const body = nonBlank(entry.requestData?.body) ?? getLoggerPayload(entry);
    if (params && body) return `${labels.params}\n${params}\n\n${labels.body}\n${body}`;
    return params ?? body;
};

export const shouldRenderLoggerSection = (entry: LoggerEntry, labels: LoggerLabels): boolean =>
    !isRequest(entry) || getRequestParams(entry, labels) !== undefined || getExpandablePayload(entry, labels) !== undefined;

export const getResponseSummary = (entry: LoggerEntry, labels: LoggerLabels): string => {
    if (entry.http?.phase !== 'response') return '';
    return [
        entry.http.status === undefined ? undefined : `${labels.status}: ${entry.http.status}`,
        entry.http.durationMs === undefined ? undefined : `${entry.http.durationMs} ms`,
    ].filter(value => value !== undefined).join(' · ');
};

export const getResponseDurationSuffix = (entry: LoggerEntry): string =>
    entry.http?.phase === 'response' && entry.http.durationMs !== undefined
        ? ` · ${entry.http.durationMs} ms`
        : '';

export const getStatusColorKey = (status: number): UIColorKey => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'icon';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500 && status < 600) return 'error';
    return 'text';
};

export const getVisibleSectionText = (entry: LoggerEntry, labels: LoggerLabels): string => {
    if (isRequest(entry)) return getExpandablePayload(entry, labels) ? labels.payload : '';
    if (entry.http || entry.type === 'response') return getResponseSummary(entry, labels);
    return getLoggerSectionContext(entry, labels);
};
