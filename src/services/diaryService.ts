import { v4 as uuidv4 } from 'uuid';
import { localDB } from '@/db/pouch';
import type { DiaryEntry, DiaryFilters } from '@/types';

// Criar nova entrada
export const createEntry = async (
    data: Omit<DiaryEntry, '_id' | 'type' | 'createdAt' | 'updatedAt'>
): Promise<DiaryEntry> => {
    const now = new Date().toISOString();

    const entry: DiaryEntry = {
        _id: uuidv4(),
        type: 'entry',
        ...data,
        createdAt: now,
        updatedAt: now,
    };

    try {
        const response = await localDB.put(entry);
        console.log('✅ Entrada criada:', response.id);

        return {
            ...entry,
            _rev: response.rev,
        };
    } catch (error) {
        console.error('❌ Erro ao criar entrada:', error);
        throw error;
    }
};

// Atualizar entrada existente
export const updateEntry = async (
    id: string,
    data: Partial<Omit<DiaryEntry, '_id' | 'type' | 'createdAt'>>
): Promise<DiaryEntry> => {
    try {
        const existing = (await localDB.get(id)) as DiaryEntry;

        const updated: DiaryEntry = {
            ...existing,
            ...data,
            _id: existing._id,
            type: 'entry',
            createdAt: existing.createdAt,
            updatedAt: new Date().toISOString(),
        };

        const response = await localDB.put(updated);
        console.log('✅ Entrada atualizada:', response.id);

        return {
            ...updated,
            _rev: response.rev,
        };
    } catch (error) {
        console.error('❌ Erro ao atualizar entrada:', error);
        throw error;
    }
};

// Deletar entrada
export const deleteEntry = async (id: string): Promise<void> => {
    try {
        const doc = await localDB.get(id);
        await localDB.remove(doc);
        console.log('✅ Entrada deletada:', id);
    } catch (error) {
        console.error('❌ Erro ao deletar entrada:', error);
        throw error;
    }
};

// Buscar entrada por ID
export const getEntryById = async (id: string): Promise<DiaryEntry | null> => {
    try {
        const entry = (await localDB.get(id)) as DiaryEntry;
        return entry;
    } catch (error) {
        if ((error as any).status === 404) {
            return null;
        }
        console.error('❌ Erro ao buscar entrada:', error);
        throw error;
    }
};

// Listar todas as entradas (ordenadas por data, mais recente primeiro)
export const getAllEntries = async (): Promise<DiaryEntry[]> => {
    try {
        const result = await localDB.find({
            selector: {
                type: 'entry',
            },
            // Removido sort do PouchDB para evitar erros de índice
            // sort: [{ date: 'desc' }],
        });

        const entries = result.docs as DiaryEntry[];

        // Ordenar em memória (mais robusto)
        return entries.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
        console.error('❌ Erro ao listar entradas:', error);
        throw error;
    }
};

// Listar entradas com filtros
export const getEntriesWithFilters = async (
    filters: DiaryFilters
): Promise<DiaryEntry[]> => {
    try {
        // Construir seletor dinâmico
        const selector: any = {
            type: 'entry',
        };

        // Filtro por data
        if (filters.startDate || filters.endDate) {
            selector.date = {};
            if (filters.startDate) {
                selector.date.$gte = filters.startDate;
            }
            if (filters.endDate) {
                selector.date.$lte = filters.endDate;
            }
        } else if (filters.month !== undefined && filters.year !== undefined) {
            // Filtro por mês/ano
            const monthStr = filters.month.toString().padStart(2, '0');
            const yearStr = filters.year.toString();
            const startDate = `${yearStr}-${monthStr}-01`;
            const endDate = `${yearStr}-${monthStr}-31`;

            selector.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        // Filtro por humor
        if (filters.mood) {
            selector.mood = filters.mood;
        }

        // Filtro por clima
        if (filters.weather) {
            selector.weather = filters.weather;
        }

        // Buscar com seletor (sem sort no banco)
        const result = await localDB.find({
            selector,
            // sort: [{ date: 'desc' }],
        });

        let entries = result.docs as DiaryEntry[];

        // Filtro por tags (feito em memória)
        if (filters.tags && filters.tags.length > 0) {
            entries = entries.filter(entry =>
                filters.tags!.some(tag => entry.tags.includes(tag))
            );
        }

        // Ordenar em memória
        return entries.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
        console.error('❌ Erro ao filtrar entradas:', error);
        throw error;
    }
};

// Buscar todas as tags únicas
export const getAllTags = async (): Promise<string[]> => {
    try {
        const entries = await getAllEntries();
        const tagsSet = new Set<string>();

        entries.forEach(entry => {
            entry.tags.forEach(tag => tagsSet.add(tag));
        });

        return Array.from(tagsSet).sort();
    } catch (error) {
        console.error('❌ Erro ao buscar tags:', error);
        throw error;
    }
};

// Verificar se há conflitos em uma entrada
export const hasConflicts = (entry: DiaryEntry): boolean => {
    return !!(entry._conflicts && entry._conflicts.length > 0);
};

// Resolver conflito escolhendo uma versão
export const resolveConflict = async (
    entryId: string,
    keepRev: string
): Promise<void> => {
    try {
        const entry = (await localDB.get(entryId, {
            conflicts: true,
        })) as DiaryEntry;

        if (!entry._conflicts || entry._conflicts.length === 0) {
            console.log('⚠️ Nenhum conflito encontrado');
            return;
        }

        // Se a revisão a manter não é a atual, trocar
        if (entry._rev !== keepRev) {
            const conflictedVersion = (await localDB.get(entryId, {
                rev: keepRev,
            })) as DiaryEntry;

            // Atualizar com a versão escolhida
            await localDB.put({
                ...conflictedVersion,
                _rev: entry._rev,
            });
        }

        // Remover todas as outras revisões conflitantes
        for (const conflictRev of entry._conflicts) {
            if (conflictRev !== keepRev) {
                await localDB.remove(entryId, conflictRev);
            }
        }

        console.log('✅ Conflito resolvido');
    } catch (error) {
        console.error('❌ Erro ao resolver conflito:', error);
        throw error;
    }
};
