// (from: https://murashun.jp/blog/20171210-01.html)

const CACHE_NAME = '20181013-01';
// TODO: Hard code
const CACHE_FILE = [
  '/',
  '/index.html',
  // Generate by Ruby:
  // puts File.read('index.html').scan(%r{(link.+stylesheet.+href|src)="(.+?)"}).map{|e| "\"#{e[1]}\""}.join(",\n")
  "bower_components/opal/opal/0.11.3/opal.min.js",
  "bower_components/opal/opal/0.11.3/opal-parser.min.js",
  "node_modules/url-parse/dist/url-parse.min.js",
  "node_modules/pako/dist/pako.min.js",
  "node_modules/lzma/src/lzma_worker-min.js",
  "node_modules/ace-builds/src-min-noconflict/ace.js",
  "node_modules/angular/angular.min.js",
  "node_modules/ace-angular/ace-angular.js",
  "js/app.js",
  "node_modules/@babel/standalone/babel.min.js",
  "node_modules/purecss/build/pure-min.css",
  "node_modules/purecss/build/grids-responsive-min.css",
  "images/twitter.png"
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILE);
    })
   );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(cacheName) {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      
      // Clone request
      let ReqClone = event.request.clone();
      return fetch(ReqClone).then(function(response) {
        if (!response ||
            response.status !== 200 ||
            response.type !== 'basic') {
          return response;
        }
        
        // Clone response
        let ResClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, ResClone);
        });
        return response;
      });
    })
  );
});