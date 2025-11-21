// Tipo base para documentos PouchDB
export interface BaseDocument {
    _id: string;
    _rev?: string;
    _conflicts?: string[];
}

// Tipo principal: Entrada do Diário
export interface DiaryEntry extends BaseDocument {
    type: 'entry';
    date: string; // YYYY-MM-DD
    mood: Mood;
    weather: Weather;
    text: string;
    tags: string[];
    location: string | null;
    attachments: string[]; // URLs ou base64 (futuro)
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
}

// Enums para Humor
export type Mood =
    | 'muito_feliz'
    | 'feliz'
    | 'neutro'
    | 'triste'
    | 'muito_triste'
    | 'animado'
    | 'cansado'
    | 'inspirado';

// Enums para Clima
export type Weather =
    | 'ensolarado'
    | 'nublado'
    | 'chuvoso'
    | 'tempestade'
    | 'nevando'
    | 'ventoso'
    | 'nebuloso';

// Documento de configuração
export interface ConfigDocument extends BaseDocument {
    type: 'config';
    theme: 'light' | 'dark';
    syncEnabled: boolean;
    lastSync?: string;
}

// Status de sincronização
export type SyncStatus =
    | 'offline'
    | 'online'
    | 'syncing'
    | 'synced'
    | 'error';

// Informações de sincronização
export interface SyncInfo {
    status: SyncStatus;
    lastSync?: Date;
    error?: string;
}

// Filtros para listagem
export interface DiaryFilters {
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
    tags?: string[];
    mood?: Mood;
    weather?: Weather;
}
