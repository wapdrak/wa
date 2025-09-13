// Soubor: js/nav.js
// Tento skript se stará POUZE o generování navigace na základě centrálního seznamu.

// --- CENTRÁLNÍ SPRÁVA NAVIGAČNÍCH ODKAZŮ ---
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
 * Generuje a vkládá HTML kód navigace.
 */
function generateNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const isActive = (href) => (href.split('/').pop() || 'index.html') === currentPage;

    const desktopLinks = navLinks.slice(0, 5).map(link => 
        `<a href="${link.href}" title="${link.title}" class="${isActive(link.href) ? 'bg-sky-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors">${link.text}</a>`
    ).join('');

    const dropdownLinks = navLinks.slice(5).map(link => 
        `<a href="${link.href}" title="${link.title}" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">${link.text}</a>`
    ).join('');
    
    const mobileLinks = navLinks.map(link => 
        `<a href="${link.href}" title="${link.title}" class="${isActive(link.href) ? 'bg-sky-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium">${link.text}</a>`
    ).join('');

    navPlaceholder.innerHTML = `
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
        <div x-show="isMenuOpen" x-transition x-cloak class="md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">${mobileLinks}</div>
        </div>
    </nav>`;
}

// Spuštění generování navigace po načtení stránky
document.addEventListener('DOMContentLoaded', generateNavigation);

