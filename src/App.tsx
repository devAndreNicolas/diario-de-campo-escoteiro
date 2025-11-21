import { useState, useEffect } from 'react';
import { initDB } from '@/db/pouch';
import { SyncStatusBanner } from '@/components/SyncStatusBanner';
import { HomePage } from '@/pages/HomePage';
import { NewEntryPage } from '@/pages/NewEntryPage';
import { EditEntryPage } from '@/pages/EditEntryPage';

type Page =
    | { type: 'home' }
    | { type: 'new' }
    | { type: 'edit'; entryId: string };

function App() {
    const [currentPage, setCurrentPage] = useState<Page>({ type: 'home' });
    const [dbInitialized, setDbInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            const success = await initDB();
            setDbInitialized(success);
        };
        init();
    }, []);

    if (!dbInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-scout-purple via-purple-700 to-scout-blue flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-6">⚜️</div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Diário de Campo Escoteiro
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-white">
                        <div className="animate-spin text-3xl">⏳</div>
                        <p className="text-xl">Inicializando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <SyncStatusBanner />

            {currentPage.type === 'home' && (
                <HomePage
                    onNewEntry={() => setCurrentPage({ type: 'new' })}
                    onEditEntry={(entryId) => setCurrentPage({ type: 'edit', entryId })}
                />
            )}

            {currentPage.type === 'new' && (
                <NewEntryPage onBack={() => setCurrentPage({ type: 'home' })} />
            )}

            {currentPage.type === 'edit' && (
                <EditEntryPage
                    entryId={currentPage.entryId}
                    onBack={() => setCurrentPage({ type: 'home' })}
                />
            )}
        </div>
    );
}

export default App;
