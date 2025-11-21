import { useState, useEffect } from 'react';
import { onSyncStatusChange, startSync, getSyncStatus } from '@/db/sync';
import type { SyncInfo } from '@/types';

export const useSync = () => {
    const [syncInfo, setSyncInfo] = useState<SyncInfo>(() => {
        const status = getSyncStatus();
        return {
            status: status.status,
            lastSync: status.lastSync || undefined,
            error: status.error || undefined,
        };
    });

    useEffect(() => {
        // Registrar callback de mudança de status
        const unsubscribe = onSyncStatusChange((status, lastSync, error) => {
            setSyncInfo({
                status,
                lastSync,
                error,
            });
        });

        // Iniciar sincronização
        startSync();

        // Cleanup
        return () => {
            unsubscribe();
        };
    }, []);

    return syncInfo;
};
