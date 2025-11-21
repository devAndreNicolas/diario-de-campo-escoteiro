import { EntryForm } from '@/components/EntryForm';
import { useDiaryEntry } from '@/hooks/useDiaryEntries';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import type { DiaryEntry } from '@/types';

interface EditEntryPageProps {
    entryId: string;
    onBack: () => void;
}

export const EditEntryPage = ({ entryId, onBack }: EditEntryPageProps) => {
    const { entry, loading, error } = useDiaryEntry(entryId);
    const { updateEntry, deleteEntry } = useDiaryEntries();

    const handleSubmit = async (
        data: Omit<DiaryEntry, '_id' | 'type' | 'createdAt' | 'updatedAt'>
    ) => {
        await updateEntry(entryId, data);
        onBack();
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja deletar esta entrada?')) {
            await deleteEntry(entryId);
            onBack();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-scout-purple via-purple-700 to-scout-blue">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={onBack}
                        className="text-scout-purple hover:text-scout-blue transition-colors mb-2 flex items-center gap-2"
                    >
                        ← Voltar
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-scout-purple flex items-center gap-2">
                                ✏️ Editar Entrada
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Atualize suas anotações
                            </p>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                            🗑️ Deletar
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {loading && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-white text-lg">Carregando entrada...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <p className="font-bold">Erro ao carregar entrada</p>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && entry && (
                    <EntryForm entry={entry} onSubmit={handleSubmit} onCancel={onBack} />
                )}

                {!loading && !error && !entry && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Entrada não encontrada
                        </h2>
                        <button
                            onClick={onBack}
                            className="mt-4 bg-scout-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                        >
                            Voltar
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
