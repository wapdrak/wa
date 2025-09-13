// Tento soubor obsahuje společnou logiku pro všechny stránky.

// HLAVNÍ ALPINE.JS KOMPONENTA
document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        isMenuOpen: false, // Pro mobilní menu
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
    }));
});
