import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type LoggerEntryType = 'request' | 'response' | 'error' | 'library' | 'info' | 'warning';

export interface LoggerHttpMetadata {
    /** Unique per HTTP exchange, including concurrent calls to the same endpoint. */
    correlationId: string;
    phase: 'request' | 'response';
    status?: number;
    durationMs?: number;
}

/** Sanitized, display-ready request data supplied by the application. */
export interface LoggerRequestData {
    params?: string;
    body?: string;
}

export interface LoggerEntry {
    id: string;
    type: LoggerEntryType;
    name: string;
    message: string;
    http?: LoggerHttpMetadata;
    requestData?: LoggerRequestData;
}

export interface LoggerLabels {
    title: string;
    clear: string;
    close: string;
    empty: string;
    request: string;
    response: string;
    params: string;
    body: string;
    payload: string;
    status: string;
    copy: string;
    typeLabels?: Partial<Record<LoggerEntryType, string>>;
}

export interface LoggerProps {
    /** Pass entries newest-first. Storage and retention remain application-owned. */
    logs: readonly LoggerEntry[];
    visible: boolean;
    onClose: () => void;
    onOpen?: () => void;
    onClear?: () => void;
    onCopyEntry?: (entry: LoggerEntry, text: string) => void | Promise<void>;
    labels: LoggerLabels;
    openIcon?: ReactNode;
    copyIcon?: ReactNode;
    style?: StyleProp<ViewStyle>;
}
