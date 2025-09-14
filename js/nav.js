// Tento soubor obsahuje data a funkci POUZE pro generování navigačního menu.

const navLinks = [
    { href: "index.html", text: "Domů", title: "Přejít na domovskou stránku" },
    { href: "o-nas.html", text: "O nás", title: "Přejít na stránku O nás"},
    { href: "send.html", text: "Odesílač zpráv", title: "Přejít na nástroj pro odesílání zpráv" },
    { href: "hesla.html", text: "Generátor hesel", title: "Přejít na generátor hesel" },
    { href: "decoder.html", text: "Dekodér textů", title: "Přejít na dekodér textů" },
    { href: "notes.html", text: "Poznámkový blok", title: "Přejít na poznámkový blok" },
    { href: "txt.html", text: "Textové editory", title: "Přejít na textové editory" },
    { href: "calc.html", text: "Kalkulačka", title: "Přejít na kalkulačky" },
    { href: "qr.html", text: "Generátor kódů", title: "Přejít na generátor kódů" },
    { href: "radio.html", text: "Online Rádio", title: "Přejít na online rádio" },
    { href: "citaty.html", text: "Generátor citátů", title: "Přejít na generátor citátů"},
    { href: "stamp.html", text: "Klasická razítka", title: "Přejít na generátor klasických razítek" },
    { href: "stamp-round.html", text: "Kulatá razítka", title: "Přejít na generátor kulatých razítek" },
];

// Funkce pro generování navigace
function generateNav() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    
    // Generování odkazů pro desktop (prvních 5 + "Více")
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

    // Generování odkazů pro mobilní menu (všechny)
    const mobileLinks = navLinks.map(link => {
        const isCurrent = (link.href.split("/").pop() || 'index.html') === currentPage;
        const classes = isCurrent ? 'block px-3 py-2 rounded-md text-base font-bold text-white bg-gray-700' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700';
        return `<li><a href="${link.href}" class="${classes}" title="${link.title}">${link.text}</a></li>`;
    }).join('');

    const navHTML = `
    <nav class="sticky top-0 z-50 bg-gray-900 bg-opacity-70 backdrop-blur-sm border-b border-gray-700 shadow-lg" @click.away="isMenuOpen = false">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <a href="index.html" class="flex-shrink-0" title="Domů">
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
                ${mobileLinks}
            </ul>
        </div>
    </nav>`;
    navPlaceholder.innerHTML = navHTML;
}


