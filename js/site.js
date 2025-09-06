/**
 * Vytváří a vrací datový objekt pro Alpine.js, který kombinuje sdílenou logiku
 * s logikou specifickou pro danou stránku.
 * @param {object} pageLogic - Objekt s vlastnostmi specifickými pro stránku (např. title).
 * @returns {object} - Kompletní datový objekt pro Alpine.js.
 */
function createApp(pageLogic = {}) {
    const sharedLogic = {
        // =====================================================
        // 📣 SHARE LOGIC
        // =====================================================
        isShareModalOpen: false,
        sharePlatforms: [
            { name: 'system', title: 'Sdílení systému', icon: 'fas fa-external-link-alt', color: 'text-purple-400', label: 'Systém' },
            { name: 'whatsapp', title: 'Sdílet na WhatsApp', icon: 'fab fa-whatsapp', color: 'text-green-500', label: 'WhatsApp' },
            { name: 'facebook', title: 'Sdílet na Facebooku', icon: 'fab fa-facebook-f', color: 'text-blue-600', label: 'Facebook' },
            { name: 'twitter', title: 'Sdílet na Twitteru', icon: 'fab fa-twitter', color: 'text-blue-400', label: 'Twitter' },
            { name: 'telegram', title: 'Sdílet na Telegramu', icon: 'fab fa-telegram-plane', color: 'text-blue-500', label: 'Telegram' },
            { name: 'linkedin', title: 'Sdílet na LinkedIn', icon: 'fab fa-linkedin-in', color: 'text-blue-700', label: 'LinkedIn' },
            { name: 'email', title: 'Sdílet e-mailem', icon: 'fas fa-envelope', color: 'text-gray-400', label: 'E-mail' },
            { name: 'sms', title: 'Sdílet pomocí SMS', icon: 'fas fa-sms', color: 'text-yellow-500', label: 'SMS' },
            { name: 'print', title: 'Tisk', icon: 'fas fa-print', color: 'text-gray-400', label: 'Tisk' },
            { name: 'copy', title: 'Kopírovat adresu', icon: 'fas fa-copy', color: 'text-gray-400', label: 'Kopírovat' },
        ],
        async share(platform) {
            const url = window.location.href;
            const title = document.title;
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
                case 'copy': this.copyShareLink(); return;
            }
            window.open(shareUrl, '_blank', 'width=600,height=400');
        },
        copyShareLink() {
            const textToCopy = window.location.href;
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); }
            catch (err) { console.error('Oops, unable to copy', err); }
            document.body.removeChild(textArea);
        },
        automateNav() {
            const currentPage = window.location.pathname.split("/").pop() || 'index.html';
            const navLinks = document.querySelectorAll('#main-nav a');
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href').split("/").pop();
                if (linkPage === currentPage) {
                    link.classList.remove('text-gray-300', 'hover:text-white');
                    link.classList.add('text-white', 'font-bold');
                    link.setAttribute('aria-current', 'page');
                }
            });
        },
        init() {
            this.automateNav();
            if (typeof this.pageInit === 'function') {
                this.pageInit();
            }
        }
    };
    return { ...sharedLogic, ...pageLogic };
}

/**
 * Generuje a vkládá HTML patičky na místo určeného placeholderu.
 */
function generateFooter() {
    // ======================================================================
    // 🚀 FOOTER & SHARE MODAL GENERATION
    // ======================================================================
    const footerHTML = `
    <footer class="w-full p-2 text-center text-gray-400 mt-4">
        <div class="flex justify-center items-center mb-2">
            <button @click="isShareModalOpen = true" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg transition-colors flex items-center text-sm" title="Sdílet tuto stránku">
                <i class="fas fa-share-alt mr-2"></i> Sdílet
            </button>
        </div>
        <p class="text-sm">&copy; 2024 <a href="https://github.com/wapdrak" target="_blank" rel="noopener noreferrer" class="underline hover:text-white" title="Přejít na WapDrak na GitHubu">WapDrak</a>. Všechna práva vyhrazena.</p>
        <div x-show="isShareModalOpen" @keydown.escape.window="isShareModalOpen = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;">
            <div @click.away="isShareModalOpen = false" class="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl w-full max-w-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Sdílet stránku</h3>
                    <button @click="isShareModalOpen = false" class="text-gray-400 hover:text-white" title="Zavřít">&times;</button>
                </div>
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <template x-for="platform in sharePlatforms" :key="platform.name">
                        <button @click="share(platform.name)" :title="platform.title" class="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                            <i :class="platform.icon + ' ' + platform.color" class="text-3xl mb-1"></i>
                            <span class="text-xs" x-text="platform.label"></span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </footer>`;
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = footerHTML;
    }
}

// ======================================================================
// 🚀 INITIALIZATION
// Hlavní vstupní bod, který se spustí, když je Alpine připraven.
// ======================================================================
document.addEventListener('alpine:init', () => {
    // Zkontroluje, zda byla v HTML definována globální proměnná pageSpecificLogic
    if (typeof pageSpecificLogic !== 'undefined') {
        Alpine.data('app', () => createApp(pageSpecificLogic));
    } else {
        console.error('Chyba: pageSpecificLogic není definována. Ujistěte se, že je skript s daty vložen před site.js.');
        Alpine.data('app', () => createApp({ title: 'Chyba načítání' }));
    }
});

document.addEventListener('DOMContentLoaded', generateFooter);

