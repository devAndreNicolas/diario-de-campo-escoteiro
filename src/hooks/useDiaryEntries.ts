import { useState, useEffect, useCallback } from 'react';
import {
    getAllEntries,
    getEntriesWithFilters,
    createEntry as createEntryService,
    updateEntry as updateEntryService,
    deleteEntry as deleteEntryService,
    getEntryById,
} from '@/services/diaryService';
import type { DiaryEntry, DiaryFilters } from '@/types';
import { localDB } from '@/db/pouch';

export const useDiaryEntries = (filters?: DiaryFilters) => {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar entradas
    const loadEntries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = filters
                ? await getEntriesWithFilters(filters)
                : await getAllEntries();

            setEntries(data);
        } catch (err) {
            setError((err as Error).message);
            console.error('Erro ao carregar entradas:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Criar entrada
    const createEntry = useCallback(
        async (data: Omit<DiaryEntry, '_id' | 'type' | 'createdAt' | 'updatedAt'>) => {
            try {
                const newEntry = await createEntryService(data);
                // Não precisamos recarregar manualmente pois o changes feed fará isso
                return newEntry;
            } catch (err) {
                setError((err as Error).message);
                throw err;
            }
        },
        []
    );

    // Atualizar entrada
    const updateEntry = useCallback(
        async (
            id: string,
            data: Partial<Omit<DiaryEntry, '_id' | 'type' | 'createdAt'>>
        ) => {
            try {
                const updated = await updateEntryService(id, data);
                return updated;
            } catch (err) {
                setError((err as Error).message);
                throw err;
            }
        },
        []
    );

    // Deletar entrada
    const deleteEntry = useCallback(
        async (id: string) => {
            try {
                await deleteEntryService(id);
            } catch (err) {
                setError((err as Error).message);
                throw err;
            }
        },
        []
    );

    // Carregar ao montar e quando filtros mudarem
    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    // Escutar mudanças no banco (para sincronização)
    useEffect(() => {
        const changes = localDB
            .changes({
                since: 'now',
                live: true,
                include_docs: true,
            })
            .on('change', () => {
                loadEntries();
            })
            .on('error', (err: any) => {
                console.error('Erro ao escutar mudanças:', err);
            });

        return () => {
            changes.cancel();
        };
    }, [loadEntries]);

    return {
        entries,
        loading,
        error,
        createEntry,
        updateEntry,
        deleteEntry,
        refresh: loadEntries,
    };
};

// Hook para uma entrada específica
export const useDiaryEntry = (id: string | null) => {
    const [entry, setEntry] = useState<DiaryEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setEntry(null);
            setLoading(false);
            return;
        }

        const loadEntry = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getEntryById(id);
                setEntry(data);
            } catch (err) {
                setError((err as Error).message);
                console.error('Erro ao carregar entrada:', err);
            } finally {
                setLoading(false);
            }
        };

        loadEntry();
    }, [id]);

    return { entry, loading, error };
};
