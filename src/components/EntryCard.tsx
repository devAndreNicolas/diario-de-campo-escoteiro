import type { DiaryEntry, Mood, Weather } from '@/types';
import { hasConflicts } from '@/services/diaryService';

interface EntryCardProps {
    entry: DiaryEntry;
    onClick?: () => void;
}

const moodEmojis: Record<Mood, string> = {
    muito_feliz: '😄',
    feliz: '😊',
    neutro: '😐',
    triste: '😢',
    muito_triste: '😭',
    animado: '🤩',
    cansado: '😴',
    inspirado: '✨',
};

const weatherEmojis: Record<Weather, string> = {
    ensolarado: '☀️',
    nublado: '☁️',
    chuvoso: '🌧️',
    tempestade: '⛈️',
    nevando: '❄️',
    ventoso: '💨',
    nebuloso: '🌫️',
};

export const EntryCard = ({ entry, onClick }: EntryCardProps) => {
    const hasConflict = hasConflicts(entry);
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-5 border-l-4 border-scout-purple relative"
        >
            {/* Indicador de conflito */}
            {hasConflict && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    ⚠️ Conflito
                </div>
            )}

            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600 font-medium capitalize">
                    {formattedDate}
                </div>
                <div className="flex gap-2">
                    <span className="text-2xl" title={entry.mood}>
                        {moodEmojis[entry.mood]}
                    </span>
                    <span className="text-2xl" title={entry.weather}>
                        {weatherEmojis[entry.weather]}
                    </span>
                </div>
            </div>

            {/* Texto */}
            <p className="text-gray-800 mb-3 line-clamp-3">
                {entry.text}
            </p>

            {/* Tags */}
            {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {entry.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-scout-gold bg-opacity-20 text-scout-purple text-xs px-2 py-1 rounded-full font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Localização */}
            {entry.location && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <span>📍</span>
                    <span>{entry.location}</span>
                </div>
            )}
        </div>
    );
};
