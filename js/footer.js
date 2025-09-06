/**
 * Tento skript dynamicky generuje patičku webu.
 * Najde na stránce element s ID 'footer-placeholder' a nahradí ho kompletním HTML kódem patičky.
 * Tím je zajištěno, že všechny stránky sdílejí stejnou patičku spravovanou z jednoho místa.
 */
function generateFooter() {
    // Kompletní HTML kód pro patičku, včetně modálního okna pro sdílení.
    const footerHTML = `
        <footer class="w-full p-2 text-center text-gray-400 mt-4">
            <div class="flex justify-center items-center mb-2">
                <button @click="isShareModalOpen = true" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg transition-colors flex items-center text-sm" title="Sdílet tuto stránku">
                    <i class="fas fa-share-alt mr-2"></i> Sdílet
                </button>
            </div>
            <p class="text-sm">&copy; 2024 <a href="https://github.com/wapdrak" target="_blank" rel="noopener noreferrer" class="underline hover:text-white" title="Přejít na WapDrak na GitHubu">WapDrak</a>. Všechna práva vyhrazena.</p>
            
            <!-- MODÁLNÍ OKNO PRO SDÍLENÍ (generováno skriptem) -->
            <div x-show="isShareModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;">
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
        </footer>
    `;

    // Najde placeholder na stránce a nahradí ho vygenerovanou patičkou.
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = footerHTML;
    } else {
        // Pojistka pro případ, že by placeholder chyběl - patička se vloží na konec těla dokumentu.
        console.warn('Placeholder pro patičku (footer-placeholder) nebyl nalezen. Patička byla vložena na konec stránky.');
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

// Skript se spustí, jakmile je HTML struktura stránky připravena.
document.addEventListener('DOMContentLoaded', generateFooter);
