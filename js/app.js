// Tento soubor obsahuje veškerou společnou logiku pro všechny stránky.

// HLAVNÍ ALPINE.JS KOMPONENTA
function app() {
    return {
        isMenuOpen: false,
        isShareModalOpen: false,
        deferredPrompt: null,
        canInstall: false,
        sharePlatforms: [
            { name: 'install', title: 'Instalovat aplikaci', icon: 'fas fa-download', color: 'text-sky-400', label: 'Instalovat' },
            { name: 'system', title: 'Sdílet přes systém', icon: 'fas fa-share-alt', color: 'text-purple-400', label: 'Sdílet...' },
            { name: 'whatsapp', title: 'Sdílet na WhatsApp', icon: 'fab fa-whatsapp', color: 'text-green-500', label: 'WhatsApp' },
            { name: 'facebook', title: 'Sdílet na Facebooku', icon: 'fab fa-facebook-f', color: 'text-blue-600', label: 'Facebook' },
            { name: 'twitter', title: 'Sdílet na Twitteru', icon: 'fab fa-twitter', color: 'text-blue-400', label: 'Twitter' },
            { name: 'telegram', title: 'Sdílet na Telegramu', icon: 'fab fa-telegram-plane', color: 'text-blue-500', label: 'Telegram' },
            { name: 'linkedin', title: 'Sdílet na LinkedIn', icon: 'fab fa-linkedin-in', color: 'text-blue-700', label: 'LinkedIn' },
            { name: 'email', title: 'Sdílet e-mailem', icon: 'fas fa-envelope', color: 'text-gray-400', label: 'E-mail' },
            { name: 'sms', title: 'Sdílet pomocí SMS', icon: 'fas fa-sms', color: 'text-yellow-500', label: 'SMS' },
            { name: 'print', title: 'Vytisknout stránku', icon: 'fas fa-print', color: 'text-gray-400', label: 'Tisk' },
            { name: 'copy', title: 'Kopírovat adresu', icon: 'fas fa-copy', color: 'text-gray-400', label: 'Kopírovat' },
        ],
        async share(platform) {
            const url = window.location.href;
            const title = document.title;
            if (platform === 'install') { this.installPWA(); return; }
            if (platform === 'system' && navigator.share) { try { await navigator.share({ title, url }); return; } catch (err) { console.error('Chyba při systémovém sdílení:', err); } }
            let shareUrl = '';
            switch (platform) {
                case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%0A${encodeURIComponent(url)}`; break;
                case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
                case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`; break;
                case 'telegram': shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`; break;
                case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`; break;
                case 'email': shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=Doporučuji:%0A%0A${encodeURIComponent(url)}`; break;
                case 'sms': shareUrl = `sms:?&body=${encodeURIComponent(title)}%0A${encodeURIComponent(url)}`; break;
                case 'print': window.print(); return;
                case 'copy': navigator.clipboard.writeText(url).then(() => alert('Odkaz zkopírován do schránky!')); return;
            }
            if (shareUrl) { window.open(shareUrl, '_blank', 'width=600,height=400'); }
        },
        async installPWA() {
            if (!this.deferredPrompt) { alert('Aplikaci nelze momentálně nainstalovat.'); return; }
            this.deferredPrompt.prompt();
            await this.deferredPrompt.userChoice;
            this.deferredPrompt = null; this.canInstall = false; this.isShareModalOpen = false;
        },
        init() {
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this.canInstall = true;
            });
            this.$root.addEventListener('open-share-modal', () => { this.isShareModalOpen = true; });
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Generování Navigace a Patičky
    if (typeof generateNav === 'function') {
        generateNav();
    }
    
    function createFooterHTML() {
        return `
        <div class="w-full p-4 text-center text-gray-400 mt-8">
            <div class="flex justify-center items-center mb-4">
                <button @click="$dispatch('open-share-modal')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center" title="Sdílet tuto stránku">
                    <i class="fas fa-share-alt mr-2"></i> Sdílet
                </button>
            </div>
            <p class="text-sm">&copy; ${new Date().getFullYear()} <a href="https://github.com/wapdrak" target="_blank" rel="noopener noreferrer" class="underline hover:text-white" title="Přejít na WapDrak na GitHubu">WapDrak</a>. Všechna práva vyhrazena.</p>
        </div>`;
    }
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) footerPlaceholder.innerHTML = createFooterHTML();

    const grid = document.getElementById('main-content-grid');
    if(grid && typeof navLinks !== 'undefined') {
        const toolLinks = navLinks.slice(1).map(link => `<a href="${link.href}" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-lg transition-colors flex items-center justify-center text-center" title="${link.title.replace('Přejít na ', '')}">${link.text}</a>`).join('');
        grid.innerHTML = toolLinks;
    }

    // PWA MANIFEST A SERVICE WORKER
    if ('serviceWorker' in navigator) {
        const manifest = {
            "name": "WapDrak Nástroje", "short_name": "WapDrak", "start_url": "https://kidum.top/",
            "display": "standalone", "background_color": "#111827", "theme_color": "#1f2937",
            "description": "Sada bezplatných online nástrojů.", "icons": [
                { "src": "https://kidum.top/img/wa.jpg", "sizes": "192x192", "type": "image/jpeg" },
                { "src": "https://kidum.top/img/wa.jpg", "sizes": "512x512", "type": "image/jpeg" }
            ]
        };
        const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        document.getElementById('manifest').href = URL.createObjectURL(manifestBlob);
        const serviceWorkerCode = `
            const CACHE_NAME = 'wapdrak-nastroje-v3';
            const urlsToCache = [
                'https://kidum.top/', 'https://kidum.top/index.html', 'https://kidum.top/send.html',
                'https://kidum.top/hesla.html', 'https://kidum.top/decoder.html', 'https://kidum.top/notes.html',
                'https://kidum.top/txt.html', 'https://kidum.top/calc.html', 'https://kidum.top/qr.html',
                'https://kidum.top/radio.html', 'https://kidum.top/stamp.html', 
                'https://kidum.top/js/nav.js',
                'https://kidum.top/js/app.js'
            ];
            self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))));
            self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
            self.addEventListener('activate', event => {
                const cacheWhitelist = [CACHE_NAME];
                event.waitUntil(
                    caches.keys().then(cacheNames => Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheWhitelist.indexOf(cacheName) === -1) {
                                return caches.delete(cacheName);
                            }
                        })
                    ))
                );
            });
        `;
        const swBlob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
        navigator.serviceWorker.register(URL.createObjectURL(swBlob))
            .then(reg => console.log('ServiceWorker registrován:', reg))
            .catch(err => console.log('Registrace ServiceWorker selhala:', err));
    }
});

