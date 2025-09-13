document.addEventListener('DOMContentLoaded', () => {
    
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

    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = createFooterHTML();
    }
});
