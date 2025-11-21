const CACHE_NAME = 'diario-escoteiro-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Cache aberto');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estratégia Cache-First
self.addEventListener('fetch', (event) => {
    // Ignorar requisições que não são GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Ignorar requisições para o CouchDB (sempre ir para a rede)
    if (event.request.url.includes('localhost:5984')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - retornar resposta do cache
            if (response) {
                return response;
            }

            // Clone da requisição
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then((response) => {
                // Verificar se é uma resposta válida
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone da resposta
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Se falhar, tentar retornar a página offline
                return caches.match('/index.html');
            });
        })
    );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
