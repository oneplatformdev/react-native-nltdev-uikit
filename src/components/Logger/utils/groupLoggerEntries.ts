import type { LoggerEntry } from '../types/types';

export type LoggerPresentationItem =
    | { kind: 'entry'; key: string; entry: LoggerEntry }
    | { kind: 'exchange'; key: string; request?: LoggerEntry; response?: LoggerEntry };

export const groupLoggerEntries = (logs: readonly LoggerEntry[]): LoggerPresentationItem[] => {
    const items: LoggerPresentationItem[] = [];
    const exchanges = new Map<string, Extract<LoggerPresentationItem, { kind: 'exchange' }>>();

    for (const entry of logs) {
        const { correlationId, phase } = entry.http ?? {};
        if (!correlationId || !phase) {
            items.push({ kind: 'entry', key: `entry:${entry.id}`, entry });
            continue;
        }

        let exchange = exchanges.get(correlationId);
        if (!exchange) {
            exchange = { kind: 'exchange', key: `exchange:${correlationId}` };
            exchanges.set(correlationId, exchange);
            items.push(exchange);
        }

        if (exchange[phase]) {
            items.push({ kind: 'entry', key: `entry:${entry.id}`, entry });
        } else {
            exchange[phase] = entry;
        }
    }

    return items;
};

export const toggleExpandedEntryId = (previous: ReadonlySet<string>, id: string): Set<string> => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
};
