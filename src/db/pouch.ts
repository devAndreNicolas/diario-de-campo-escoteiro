import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

// Adicionar plugin find
PouchDB.plugin(PouchDBFind);

// Nome do banco local
const LOCAL_DB_NAME = import.meta.env.VITE_DB_NAME || 'diario-escoteiro';

// URL do CouchDB remoto
const REMOTE_DB_URL = import.meta.env.VITE_COUCHDB_URL || 'http://localhost:5984/diario';

// Extrair credenciais da URL se existirem
let remoteOptions: any = {
    skip_setup: true,
};

try {
    const url = new URL(REMOTE_DB_URL);
    if (url.username && url.password) {
        remoteOptions.auth = {
            username: url.username,
            password: url.password,
        };
        // Remover credenciais da URL para evitar vazamento em logs
        // Mas manter a URL base correta
        url.username = '';
        url.password = '';
    }
} catch (e) {
    console.error('Erro ao processar URL do CouchDB:', e);
}

// Criar instância do banco local
export const localDB = new PouchDB(LOCAL_DB_NAME, {
    auto_compaction: true,
});

// Criar instância do banco remoto
export const remoteDB = new PouchDB(REMOTE_DB_URL, remoteOptions);

// Criar índices para queries eficientes
export const createIndexes = async () => {
    try {
        // Índice por data
        await localDB.createIndex({
            index: {
                fields: ['type', 'date'],
                name: 'by-date',
            },
        });

        // Índice por tags
        await localDB.createIndex({
            index: {
                fields: ['type', 'tags'],
                name: 'by-tags',
            },
        });

        // Índice por humor
        await localDB.createIndex({
            index: {
                fields: ['type', 'mood'],
                name: 'by-mood',
            },
        });

        // Índice por clima
        await localDB.createIndex({
            index: {
                fields: ['type', 'weather'],
                name: 'by-weather',
            },
        });

        console.log('✅ Índices criados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar índices:', error);
    }
};

// Inicializar banco de dados
export const initDB = async () => {
    try {
        const info = await localDB.info();
        console.log('📦 Banco de dados local inicializado:', info);

        // Criar índices
        await createIndexes();

        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
        return false;
    }
};

// Limpar banco (útil para desenvolvimento)
export const clearDB = async () => {
    try {
        await localDB.destroy();
        console.log('🗑️ Banco de dados limpo');
    } catch (error) {
        console.error('❌ Erro ao limpar banco:', error);
    }
};

// Getters para compatibilidade (retornam as instâncias diretamente)
export const getLocalDB = async () => localDB;
export const getRemoteDB = async () => remoteDB;
