// Tento soubor obsahuje veškerou logiku webu.

// Data pro navigaci
const navLinks = [
    { href: "https://kidum.top/index.html", text: "Domů", title: "Přejít na domovskou stránku" },
    { href: "https://kidum.top/send.html", text: "Odesílač zpráv", title: "Přejít na nástroj pro odesílání zpráv" },
    { href: "https://kidum.top/hesla.html", text: "Generátor hesel", title: "Přejít na generátor hesel" },
    { href: "https://kidum.top/decoder.html", text: "Dekodér textů", title: "Přejít na dekodér textů" },
    { href: "https://kidum.top/notes.html", text: "Poznámkový blok", title: "Přejít na poznámkový blok" },
    { href: "https://kidum.top/txt.html", text: "Textové editory", title: "Přejít na textové editory" },
    { href: "https://kidum.top/calc.html", text: "Kalkulačka", title: "Přejít na kalkulačky" },
    { href: "https://kidum.top/qr.html", text: "Generátor kódů", title: "Přejít na generátor kódů" },
    { href: "https://kidum.top/radio.html", text: "Online Rádio", title: "Přejít na online rádio" },
    { href: "https://kidum.top/stamp.html", text: "Generátor razítek", title: "Přejít na generátor razítek" },
];

// Funkce pro generování navigace
function generateNav() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const desktopLinks = navLinks.slice(0, 5).map(link => {
        const isCurrent = (link.href.split("/").pop() || 'index.html') === currentPage;
        const classes = isCurrent ? 'text-white font-bold' : 'text-gray-300 hover:text-white transition-colors';
        return `<li><a href="${link.href}" class="${classes}" title="${link.title}">${link.text}</a></li>`;
    }).join('');
    const moreLinks = navLinks.slice(5).map(link => {
        const isCurrent = (link.href.split("/").pop() || 'index.html') === currentPage;
        const classes = isCurrent ? 'block px-4 py-2 text-white bg-gray-700' : 'block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white';
        return `<li><a href="${link.href}" class="${classes}" title="${link.title}">${link.text}</a></li>`;
    }).join('');
    const navHTML = `
    <nav class="sticky top-0 z-50 bg-gray-900 bg-opacity-70 backdrop-blur-sm border-b border-gray-700 shadow-lg" @click.away="isMenuOpen = false">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <a href="https://kidum.top/index.html" class="flex-shrink-0" title="Domů">
                        <img class="h-10 w-10 rounded-full" src="https://kidum.top/img/wa.jpg" alt="WapDrak Logo">
                    </a>
                    <div class="hidden md:block">
                        <ul class="ml-10 flex items-baseline space-x-4">
                            ${desktopLinks}
                            ${navLinks.length > 5 ? `
                            <li class="relative" x-data="{ open: false }">
                                <button @click="open = !open" @keydown.escape.window="open = false" class="text-gray-300 hover:text-white transition-colors flex items-center">
                                    Více <i class="fas fa-chevron-down ml-1 text-xs"></i>
                                </button>
                                <ul x-show="open" @click.away="open = false" x-transition class="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                                    ${moreLinks}
                                </ul>
                            </li>` : ''}
                        </ul>
                    </div>
                </div>
                <!-- Tlačítko pro otevření palety na desktopu -->
                <div class="hidden md:block">
                    <button @click="$dispatch('open-palette')" class="px-3 py-2 text-sm text-gray-400 border border-gray-600 rounded-md hover:text-white hover:border-gray-400 transition-colors flex items-center">
                        Hledat... <span class="ml-4 text-xs border border-gray-500 rounded px-1 py-0.5">Ctrl+Shift+P</span>
                    </button>
                </div>
                <div class="-mr-2 flex md:hidden">
                    <button @click="isMenuOpen = !isMenuOpen" type="button" class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none" aria-controls="mobile-menu" aria-expanded="false">
                        <span class="sr-only">Otevřít hlavní menu</span>
                        <i class="fas fa-bars" :class="{'hidden': isMenuOpen, 'block': !isMenuOpen}"></i>
                        <i class="fas fa-times" :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}"></i>
                    </button>
                </div>
            </div>
        </div>
        <div x-show="isMenuOpen" x-transition class="md:hidden" id="mobile-menu">
            <ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                ${navLinks.map(link => {
                    const isCurrent = (link.href.split("/").pop() || 'index.html') === currentPage;
                    const classes = isCurrent ? 'block px-3 py-2 rounded-md text-base font-bold text-white bg-gray-700' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700';
                    return `<li><a href="${link.href}" class="${classes}" title="${link.title}">${link.text}</a></li>`;
                }).join('')}
            </ul>
        </div>
    </nav>`;
    navPlaceholder.outerHTML = navHTML;
}

// Funkce pro generování patičky
function generateFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;
    footerPlaceholder.innerHTML = `
    <div class="w-full p-4 text-center text-gray-400 mt-8">
        <div class="flex justify-center items-center mb-4">
            <button @click="$dispatch('open-share-modal')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center" title="Sdílet tuto stránku">
                <i class="fas fa-share-alt mr-2"></i> Sdílet
            </button>
        </div>
        <p class="text-sm">&copy; ${new Date().getFullYear()} <a href="https://github.com/wapdrak" target="_blank" rel="noopener noreferrer" class="underline hover:text-white" title="Přejít na WapDrak na GitHubu">WapDrak</a>. Všechna práva vyhrazena.</p>
    </div>`;
}

// Funkce pro generování obsahu hlavní stránky
function generateIndexGrid() {
    const grid = document.getElementById('main-content-grid');
    if(grid && typeof navLinks !== 'undefined') {
        const toolLinks = navLinks.slice(1).map(link => `<a href="${link.href}" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-lg transition-colors flex items-center justify-center text-center" title="${link.title.replace('Přejít na ', '')}">${link.text}</a>`).join('');
        grid.innerHTML = toolLinks;
    }
}

// Logika pro PWA
function setupPWA() {
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
            const CACHE_NAME = 'wapdrak-nastroje-v5'; // Zvýšená verze cache
            const urlsToCache = [
                'https://kidum.top/', 'https://kidum.top/index.html', 'https://kidum.top/send.html',
                'https://kidum.top/hesla.html', 'https://kidum.top/decoder.html', 'https://kidum.top/notes.html',
                'https://kidum.top/txt.html', 'https://kidum.top/calc.html', 'https://kidum.top/qr.html',
                'https://kidum.top/radio.html', 'https://kidum.top/stamp.html', 
                'https://kidum.top/js/main.js'
            ];
            self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))));
            self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
            self.addEventListener('activate', event => {
                const cacheWhitelist = [CACHE_NAME];
                event.waitUntil(
                    caches.keys().then(cacheNames => Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheWhitelist.indexOf(cacheName) === -1) return caches.delete(cacheName);
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
}


// Správný způsob definice Alpine.js komponenty z externího souboru
document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        // --- Stávající logika ---
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

        // --- Nová logika pro příkazovou paletu ---
        isPaletteOpen: false,
        paletteQuery: '',
        
        get paletteResults() {
            if (!this.paletteQuery) {
                return navLinks;
            }
            return navLinks.filter(link => 
                link.text.toLowerCase().includes(this.paletteQuery.toLowerCase())
            );
        },
        
        init() {
            // Generování dynamického obsahu
            generateNav();
            generateFooter();
            generateIndexGrid(); // Toto se spustí na každé stránce, ale grid najde jen na index.html
            setupPWA();
            
            // Posluchač pro klávesovou zkratku Ctrl+Shift+P
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
                    e.preventDefault();
                    this.isPaletteOpen = true;
                    // Automaticky zaměříme input pole, když se paleta otevře
                    this.$nextTick(() => { this.$refs.paletteInput.focus(); });
                }
            });

            // Posluchače pro vlastní události
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this.canInstall = true;
            });
            this.$root.addEventListener('open-share-modal', () => { this.isShareModalOpen = true; });
            this.$root.addEventListener('open-palette', () => { 
                this.isPaletteOpen = true; 
                this.$nextTick(() => { this.$refs.paletteInput.focus(); });
            });
        },
        // --- Konec nové logiky ---

        async share(platform) {
            // ... (tato funkce zůstává stejná)
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
            // ... (tato funkce zůstává stejná)
            if (!this.deferredPrompt) { alert('Aplikaci nelze momentálně nainstalovat.'); return; }
            this.deferredPrompt.prompt();
            await this.deferredPrompt.userChoice;
            this.deferredPrompt = null; this.canInstall = false; this.isShareModalOpen = false;
        },
    }));
});

