import fetch from 'node-fetch';

const COUCHDB_HOST = 'http://localhost:5984';
const AUTH = 'Basic ' + Buffer.from('adminterto:adminterto').toString('base64');

async function setConfig(section, key, value) {
    const url = `${COUCHDB_HOST}/_node/nonode@nohost/_config/${section}/${key}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': AUTH
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(value),
            headers: headers
        });

        if (response.ok) {
            console.log(`✅ Configurado ${section}/${key} = ${value}`);
        } else {
            // Tentar sem o node name específico
            const url2 = `${COUCHDB_HOST}/_config/${section}/${key}`;
            const response2 = await fetch(url2, {
                method: 'PUT',
                body: JSON.stringify(value),
                headers: headers
            });

            if (response2.ok) {
                console.log(`✅ Configurado ${section}/${key} = ${value}`);
            } else {
                console.error(`❌ Falha ao configurar ${section}/${key}: ${response2.statusText}`);
                try {
                    const text = await response2.text();
                    console.error(text);
                } catch (e) { }
            }
        }
    } catch (error) {
        console.error(`❌ Erro ao conectar ao CouchDB: ${error.message}`);
    }
}

async function setupCors() {
    console.log('🔧 Configurando CORS no CouchDB...');

    await setConfig('httpd', 'enable_cors', 'true');
    await setConfig('cors', 'origins', '*');
    await setConfig('cors', 'credentials', 'true');
    await setConfig('cors', 'methods', 'GET, PUT, POST, HEAD, DELETE');
    await setConfig('cors', 'headers', 'accept, authorization, content-type, origin, referer, x-csrf-token');

    console.log('✨ Configuração de CORS concluída!');
}

setupCors();
