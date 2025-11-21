import { useState } from 'react';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { EntryCard } from '@/components/EntryCard';
import type { DiaryFilters } from '@/types';

interface HomePageProps {
    onNewEntry: () => void;
    onEditEntry: (id: string) => void;
}

export const HomePage = ({ onNewEntry, onEditEntry }: HomePageProps) => {
    const [filters] = useState<DiaryFilters>({});
    const { entries, loading, error } = useDiaryEntries(filters);

    return (
        <div className="min-h-screen bg-gradient-to-br from-scout-purple via-purple-700 to-scout-blue">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-scout-purple flex items-center gap-2">
                                ⚜️ Diário de Campo Escoteiro
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Sempre Alerta! Registre suas aventuras
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total de Entradas</p>
                            <p className="text-3xl font-bold text-scout-purple">{entries.length}</p>
                        </div>
                        <div className="text-6xl">📖</div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-white text-lg">Carregando entradas...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                        <p className="font-bold">Erro ao carregar entradas</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && entries.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Nenhuma entrada ainda
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Comece a registrar suas aventuras escoteiras!
                        </p>
                        <button
                            onClick={onNewEntry}
                            className="bg-scout-purple text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                        >
                            ✨ Criar Primeira Entrada
                        </button>
                    </div>
                )}

                {/* Entries Grid */}
                {!loading && !error && entries.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {entries.map((entry) => (
                            <EntryCard
                                key={entry._id}
                                entry={entry}
                                onClick={() => onEditEntry(entry._id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            <button
                onClick={onNewEntry}
                className="fixed bottom-8 right-8 bg-scout-gold text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-3xl hover:scale-110"
                title="Nova Entrada"
            >
                ➕
            </button>
        </div>
    );
};
