const VERSION = "v11"
const DIR = '/Projet_MDS/Tp/'
const HOST = location.protocol + '//' + location.host

const FILECACHE = [ 
    HOST + DIR + 'images/icons/icon48.png',
    HOST + DIR + 'css/game.css',
    HOST + DIR + 'js/game.js',
    HOST + DIR + 'js/movieList.js',
    HOST + DIR + 'bootstrap/css/bootstrap.min.css',
]

self.addEventListener('install', (e) => {
    self.skipWaiting()
    console.log('Version :', VERSION);

    // mis en cache des fichiers souhaités
    e.waitUntil(
        (async () =>{
            const cache = await caches.open(VERSION)

            // on veut que tous les ajouts soient effectués
            // avant de passer à la suite, donc on utilise un Promise.all
            await Promise.all(
                // on ajoute les fichiers dans le cache
                [...FILECACHE, './offline.html'].map((path) => {
                    return cache.add(path)
                })
            )
        })()
    )
})

self.addEventListener('activate',  (e) => {
    // une fois qu'on active le servie worker, on supprime le cache des anciennes versions
    e.waitUntil(
        (async () => {
            //on recup toutes les clés du cache
            const keys = await caches.keys()

            await Promise.all(
                keys.map((k) => {
                    if(!k.includes(VERSION))
                        return caches.delete(k)
                })
            )
        })()
    )
})

self.addEventListener('fetch', (e) => {
    console.log('fetch :', e.request.url)
    console.log('fetch :', e.request.mode)
    console.log("SOMETHING");

    //si on lit une page 
    if (e.request.mode === 'navigate') {
        //on affiche un truc particulier
        e.respondWith(
            (async () => {
                // return new Response('ceci est le contenu')

                try{
                    // on charge la page demandée depuis la mémoire
                    const prelodedResponse = await e.prelodedResponse

                    // on l'a trouvée, on la retourne
                    if(prelodedResponse)
                        return prelodedResponse

                    // si on arrive là, ce n'était pas 
                    // en mémoire, dans ce cas, on essaie d'accéder à l'adresse
                    return await fetch(e.request)
                // si on a du reseau, ça déclenche une erreur    
                }catch(error){
                    //on charge le message par default
                    const cache = await caches.open(VERSION)
                    return await cache.match(DIR + 'offline.html')
                }
            })()
        )    
    }
    // pour les chargements qui ne sont pas en navigate
    else if(FILECACHE.includes(e.request.url)){
        // on sort le fichier du cache
        e.respondWith(caches.match(e.request))
    }
})