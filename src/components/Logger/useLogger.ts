import { useCallback, useMemo, useState } from 'react';
import { groupLoggerEntries, toggleExpandedEntryId } from './groupLoggerEntries';
import type { LoggerEntry } from './types';

export const useLogger = (logs: readonly LoggerEntry[]) => {
    const items = useMemo(() => groupLoggerEntries(logs), [logs]);
    const [expandedEntryIds, setExpandedEntryIds] = useState<Set<string>>(() => new Set());
    const onToggleEntry = useCallback((id: string) => {
        setExpandedEntryIds(previous => toggleExpandedEntryId(previous, id));
    }, []);

    return { items, expandedEntryIds, onToggleEntry };
};
