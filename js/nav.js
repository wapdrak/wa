// Soubor: nav.js
// Tento skript se stará o generování navigace, patičky a sdílené logiky pro všechny stránky.

// Tato funkce se spustí, až bude celý HTML dokument načten a připraven.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CENTRÁLNÍ SPRÁVA ODKAZŮ ---
    // Pro přidání nebo úpravu odkazu stačí změnit tento seznam.
    const navLinks = [
        { href: 'https://kidum.top/index.html', text: 'Domů', title: 'Přejít na domovskou stránku' },
        { href: 'https://kidum.top/send.html', text: 'Odesílač zpráv', title: 'Přejít na nástroj pro odesílání zpráv' },
        { href: 'https://kidum.top/hesla.html', text: 'Generátor hesel', title: 'Přejít na generátor hesel' },
        { href: 'https://kidum.top/decoder.html', text: 'Dekodér textů', title: 'Přejít na dekodér textů' },
        { href: 'https://kidum.top/notes.html', text: 'Poznámky', title: 'Přejít na poznámkový blok' },
        { href: 'https://kidum.top/txt.html', text: 'Textové editory', title: 'Přejít na textové editory' },
        { href: 'https://kidum.top/calc.html', text: 'Kalkulačka', title: 'Přejít na kalkulačky' },
        { href: 'https://kidum.top/qr.html', text: 'Generátor kódů', title: 'Přejít na generátor kódů' },
        { href: 'https://kidum.top/radio.html', text: 'Online Rádio', title: 'Přejít na online rádio' },
        { href: 'https://kidum.top/stamp.html', text: 'Generátor razítek', title: 'Přejít na generátor razítek' },
    ];

    /**
     * Funkce pro vygenerování HTML kódu navigace.
     * @returns {string} HTML kód pro navigaci.
     */
    function createNavHTML() {
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const isActive = (href) => (href.split('/').pop() || 'index.html') === currentPage;

        // Vytvoření odkazů pro desktopové menu
        const desktopLinks = navLinks.slice(0, 5).map(link => `
            <a href="${link.href}" title="${link.title}" class="${isActive(link.href) ? 'bg-sky-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors">${link.text}</a>
        `).join('');

        // Vytvoření odkazů pro rozbalovací "Další" menu
        const dropdownLinks = navLinks.slice(5).map(link => `
            <a href="${link.href}" title="${link.title}" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">${link.text}</a>
        `).join('');
        
        // Vytvoření odkazů pro mobilní menu
        const mobileLinks = navLinks.map(link => `
            <a href="${link.href}" title="${link.title}" class="${isActive(link.href) ? 'bg-sky-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium">${link.text}</a>
        `).join('');

        // Sestavení finálního HTML pro navigaci
        return `
        <nav x-data="{ isMenuOpen: false }" class="sticky top-0 z-50 bg-gray-900 bg-opacity-70 backdrop-blur-md border-b border-gray-700 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex-shrink-0">
                        <a href="https://kidum.top/index.html" class="flex items-center space-x-2" title="Přejít na domovskou stránku">
                            <img class="h-8 w-8 rounded-full" src="https://kidum.top/img/wa.jpg" alt="WapDrak Logo">
                            <span class="text-white font-bold text-xl">WapDrak</span>
                        </a>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            ${desktopLinks}
                            <div x-data="{ open: false }" class="relative">
                                <button @click="open = !open" @click.away="open = false" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Další <i class="fas fa-chevron-down text-xs ml-1"></i>
                                </button>
                                <div x-show="open" x-transition x-cloak class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5">
                                    ${dropdownLinks}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="-mr-2 flex md:hidden">
                        <button @click="isMenuOpen = !isMenuOpen" type="button" class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span class="sr-only">Otevřít menu</span>
                            <i :class="isMenuOpen ? 'hidden' : 'block'" class="fas fa-bars h-6 w-6"></i>
                            <i :class="isMenuOpen ? 'block' : 'hidden'" class="fas fa-times h-6 w-6"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div x-show="isMenuOpen" x-transition x-cloak class="md:hidden" id="mobile-menu">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    ${mobileLinks}
                </div>
            </div>
        </nav>`;
    }

    /**
     * Funkce pro vygenerování HTML kódu patičky.
     * @returns {string} HTML kód pro patičku.
     */
    function createFooterHTML() {
        return `
        <footer class="w-full p-4 text-center text-gray-400 mt-8">
            <div class="flex justify-center items-center mb-4">
                <button @click="$dispatch('open-share-modal')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center" title="Sdílet tuto stránku">
                    <i class="fas fa-share-alt mr-2"></i> Sdílet
                </button>
            </div>
            <p class="text-sm">&copy; ${new Date().getFullYear()} <a href="https://github.com/wapdrak" target="_blank" rel="noopener noreferrer" class="underline hover:text-white" title="Přejít na WapDrak na GitHubu">WapDrak</a>. Všechna práva vyhrazena.</p>
        </footer>`;
    }

    // Vložení vygenerovaného HTML do placeholderů na stránce
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = createNavHTML();
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = createFooterHTML();
    }

    // --- HLAVNÍ ALPINE.JS KOMPONENTA PRO CELOU APLIKACI ---
    document.addEventListener('alpine:init', () => {
        Alpine.data('app', () => ({
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
                const { outcome } = await this.deferredPrompt.userChoice;
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
        }));
    });
});
