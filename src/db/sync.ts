import { localDB, remoteDB } from './pouch';
import type { SyncStatus } from '@/types';

// Estado da sincronização
let syncHandler: any = null;
let currentStatus: SyncStatus = 'offline';
let lastSyncTime: Date | null = null;
let syncError: string | null = null;

// Callbacks para notificar mudanças de status
type StatusCallback = (status: SyncStatus, lastSync?: Date, error?: string) => void;
const statusCallbacks: StatusCallback[] = [];

// Registrar callback de status
export const onSyncStatusChange = (callback: StatusCallback) => {
    statusCallbacks.push(callback);
    // Chamar imediatamente com status atual
    callback(currentStatus, lastSyncTime || undefined, syncError || undefined);

    // Retornar função para remover callback
    return () => {
        const index = statusCallbacks.indexOf(callback);
        if (index > -1) {
            statusCallbacks.splice(index, 1);
        }
    };
};

// Notificar todos os callbacks
const notifyStatusChange = () => {
    statusCallbacks.forEach(callback => {
        callback(currentStatus, lastSyncTime || undefined, syncError || undefined);
    });
};

// Atualizar status
const updateStatus = (status: SyncStatus, error?: string) => {
    currentStatus = status;
    if (error) {
        syncError = error;
    } else {
        syncError = null;
    }
    notifyStatusChange();
};

// Verificar se está online
const checkOnlineStatus = () => {
    return navigator.onLine;
};

// Iniciar sincronização
export const startSync = async () => {
    // Verificar se já está sincronizando
    if (syncHandler) {
        console.log('⚠️ Sincronização já está ativa');
        return;
    }

    // Verificar se está online
    if (!checkOnlineStatus()) {
        updateStatus('offline');
        console.log('📴 Offline - sincronização não iniciada');
        return;
    }

    try {
        updateStatus('syncing');
        console.log('🔄 Iniciando sincronização...');

        // Configurar sincronização bidirecional
        syncHandler = localDB.sync(remoteDB, {
            live: true,
            retry: true,
            heartbeat: 10000, // 10 segundos
            timeout: 30000, // 30 segundos
        });

        // Eventos de sincronização
        syncHandler
            .on('change', (info: any) => {
                console.log('📥 Mudança detectada:', info);
                lastSyncTime = new Date();
                updateStatus('synced');
            })
            .on('paused', (err: any) => {
                if (err) {
                    console.error('⏸️ Sincronização pausada com erro:', err);
                    updateStatus('error', err instanceof Error ? err.message : String(err));
                } else {
                    console.log('⏸️ Sincronização pausada (em dia)');
                    lastSyncTime = new Date();
                    updateStatus('synced');
                }
            })
            .on('active', () => {
                console.log('▶️ Sincronização ativa');
                updateStatus('syncing');
            })
            .on('denied', (err: any) => {
                console.error('🚫 Sincronização negada:', err);
                updateStatus('error', 'Acesso negado ao servidor');
            })
            .on('complete', (info: any) => {
                console.log('✅ Sincronização completa:', info);
                lastSyncTime = new Date();
                updateStatus('synced');
            })
            .on('error', (err: any) => {
                console.error('❌ Erro na sincronização:', err);
                updateStatus('error', err instanceof Error ? err.message : String(err));
            });

        console.log('✅ Sincronização configurada');
    } catch (error) {
        console.error('❌ Erro ao iniciar sincronização:', error);
        updateStatus('error', (error as Error).message);
    }
};

// Parar sincronização
export const stopSync = () => {
    if (syncHandler) {
        syncHandler.cancel();
        syncHandler = null;
        console.log('⏹️ Sincronização parada');
    }
};

// Forçar sincronização única (não live)
export const forceSyncOnce = async () => {
    if (!checkOnlineStatus()) {
        updateStatus('offline');
        throw new Error('Sem conexão com a internet');
    }

    try {
        updateStatus('syncing');
        console.log('🔄 Forçando sincronização única...');

        const result = await localDB.sync(remoteDB, {
            timeout: 30000,
        });

        lastSyncTime = new Date();
        updateStatus('synced');
        console.log('✅ Sincronização única completa:', result);

        return result;
    } catch (error) {
        console.error('❌ Erro na sincronização forçada:', error);
        updateStatus('error', (error as Error).message);
        throw error;
    }
};

// Obter status atual
export const getSyncStatus = () => {
    return {
        status: currentStatus,
        lastSync: lastSyncTime,
        error: syncError,
    };
};

// Monitorar mudanças de conectividade
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('🌐 Conexão restaurada');
        startSync();
    });

    window.addEventListener('offline', () => {
        console.log('📴 Conexão perdida');
        stopSync();
        updateStatus('offline');
    });
}
