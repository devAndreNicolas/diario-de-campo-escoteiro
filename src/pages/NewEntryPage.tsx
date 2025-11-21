import { EntryForm } from '@/components/EntryForm';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import type { DiaryEntry } from '@/types';

interface NewEntryPageProps {
    onBack: () => void;
}

export const NewEntryPage = ({ onBack }: NewEntryPageProps) => {
    const { createEntry } = useDiaryEntries();

    const handleSubmit = async (
        data: Omit<DiaryEntry, '_id' | 'type' | 'createdAt' | 'updatedAt'>
    ) => {
        await createEntry(data);
        onBack();
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
                    <h1 className="text-3xl font-bold text-scout-purple flex items-center gap-2">
                        ✨ Nova Entrada
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Registre suas aventuras de hoje
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <EntryForm onSubmit={handleSubmit} onCancel={onBack} />
            </main>
        </div>
    );
};
