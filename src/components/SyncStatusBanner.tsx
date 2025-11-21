import { useSync } from '@/hooks/useSync';
import type { SyncStatus } from '@/types';

const statusConfig: Record<
    SyncStatus,
    { icon: string; text: string; color: string; bgColor: string }
> = {
    offline: {
        icon: '📴',
        text: 'Offline',
        color: 'text-gray-700',
        bgColor: 'bg-gray-200',
    },
    online: {
        icon: '🌐',
        text: 'Online',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
    },
    syncing: {
        icon: '🔄',
        text: 'Sincronizando...',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
    },
    synced: {
        icon: '✅',
        text: 'Sincronizado',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
    },
    error: {
        icon: '❌',
        text: 'Erro na sincronização',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
    },
};

export const SyncStatusBanner = () => {
    const syncInfo = useSync();
    const config = statusConfig[syncInfo.status];

    // Não mostrar banner se estiver online e sincronizado (estado normal)
    if (syncInfo.status === 'online' || syncInfo.status === 'synced') {
        return null;
    }

    return (
        <div
            className={`${config.bgColor} ${config.color} px-4 py-3 shadow-md border-b-2 border-opacity-20`}
        >
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="font-medium">{config.text}</span>
                </div>

                {syncInfo.lastSync && (
                    <span className="text-sm opacity-75">
                        Última sincronização: {new Date(syncInfo.lastSync).toLocaleTimeString('pt-BR')}
                    </span>
                )}

                {syncInfo.error && (
                    <span className="text-sm opacity-75">
                        {syncInfo.error}
                    </span>
                )}
            </div>
        </div>
    );
};
