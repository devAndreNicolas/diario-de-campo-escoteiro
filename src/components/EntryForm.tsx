import { useState } from 'react';
import type { DiaryEntry, Mood, Weather } from '@/types';

interface EntryFormProps {
    entry?: DiaryEntry | null;
    onSubmit: (data: Omit<DiaryEntry, '_id' | 'type' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onCancel: () => void;
}

const moods: { value: Mood; label: string; emoji: string }[] = [
    { value: 'muito_feliz', label: 'Muito Feliz', emoji: '😄' },
    { value: 'feliz', label: 'Feliz', emoji: '😊' },
    { value: 'animado', label: 'Animado', emoji: '🤩' },
    { value: 'inspirado', label: 'Inspirado', emoji: '✨' },
    { value: 'neutro', label: 'Neutro', emoji: '😐' },
    { value: 'cansado', label: 'Cansado', emoji: '😴' },
    { value: 'triste', label: 'Triste', emoji: '😢' },
    { value: 'muito_triste', label: 'Muito Triste', emoji: '😭' },
];

const weathers: { value: Weather; label: string; emoji: string }[] = [
    { value: 'ensolarado', label: 'Ensolarado', emoji: '☀️' },
    { value: 'nublado', label: 'Nublado', emoji: '☁️' },
    { value: 'chuvoso', label: 'Chuvoso', emoji: '🌧️' },
    { value: 'tempestade', label: 'Tempestade', emoji: '⛈️' },
    { value: 'ventoso', label: 'Ventoso', emoji: '💨' },
    { value: 'nebuloso', label: 'Nebuloso', emoji: '🌫️' },
    { value: 'nevando', label: 'Nevando', emoji: '❄️' },
];

export const EntryForm = ({ entry, onSubmit, onCancel }: EntryFormProps) => {
    const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
    const [mood, setMood] = useState<Mood>(entry?.mood || 'feliz');
    const [weather, setWeather] = useState<Weather>(entry?.weather || 'ensolarado');
    const [text, setText] = useState(entry?.text || '');
    const [tags, setTags] = useState(entry?.tags.join(', ') || '');
    const [location, setLocation] = useState(entry?.location || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim()) {
            alert('Por favor, escreva algo no diário!');
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                date,
                mood,
                weather,
                text: text.trim(),
                tags: tags
                    .split(',')
                    .map(t => t.trim())
                    .filter(t => t.length > 0),
                location: location.trim() || null,
                attachments: [],
            });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar entrada. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {/* Data */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Data
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scout-purple focus:border-transparent"
                    required
                />
            </div>

            {/* Humor */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    😊 Como você está se sentindo?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {moods.map((m) => (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => setMood(m.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${mood === m.value
                                ? 'border-scout-purple bg-scout-purple bg-opacity-10'
                                : 'border-gray-200 hover:border-scout-purple'
                                }`}
                        >
                            <div className="text-2xl mb-1">{m.emoji}</div>
                            <div className="text-xs font-medium">{m.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Clima */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌤️ Como está o tempo?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weathers.map((w) => (
                        <button
                            key={w.value}
                            type="button"
                            onClick={() => setWeather(w.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${weather === w.value
                                ? 'border-scout-blue bg-scout-blue bg-opacity-10'
                                : 'border-gray-200 hover:border-scout-blue'
                                }`}
                        >
                            <div className="text-2xl mb-1">{w.emoji}</div>
                            <div className="text-xs font-medium">{w.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Texto */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 O que aconteceu hoje?
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scout-purple focus:border-transparent resize-none"
                    placeholder="Conte sobre suas aventuras escoteiras..."
                    required
                />
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏷️ Tags (separadas por vírgula)
                </label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scout-purple focus:border-transparent"
                    placeholder="acampamento, caminhada, pioneiria..."
                />
            </div>

            {/* Localização */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Localização (opcional)
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scout-purple focus:border-transparent"
                    placeholder="Sede do grupo, Parque Nacional..."
                />
            </div>

            {/* Botões */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-scout-purple text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '⏳ Salvando...' : entry ? '💾 Atualizar' : '✅ Salvar'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ❌ Cancelar
                </button>
            </div>
        </form>
    );
};
