importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js');

workbox.precaching.precache([
    './',
    './index.html',
    './js/plugins-dist.js',
    './js/vendor/plugins-dist.js',
    './js/vendor/jquery/dist/jquery.min.js',
    './js/vendor/slick-carousel/slick/slick.min.js',
    './js/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min.js',
    './js/main-dist.js',
    './css/main-dist.css',
    './img/common/slider-01.JPG',
  ]);
  

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'googleapis',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ],
    }),
);

// cache images
workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif|mp3)/,
    workbox.strategies.cacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ],
    })
);

workbox.routing.registerRoute(
    /\.(?:js|css|html)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'static-resources',
    }),
);