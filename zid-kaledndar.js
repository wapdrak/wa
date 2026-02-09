async function init() {
    try {
        // 1. Načtení dat z API (přidáváme časový údaj, aby se obešla mezipaměť prohlížeče)
        const response = await fetch('zid-kalendar.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Soubor JSON nebyl nalezen.');
        const api = await response.json();

        // 2. Časová logika pro Haifu (po 18:00 už je zítřek)
        let d = new Date();
        if (d.getHours() >= 18) {
            d.setDate(d.getDate() + 1);
        }

        // 3. Den v týdnu
        const denIndex = d.getDay(); // 0 = Neděle
        const jomTxt = document.getElementById('jom-txt');
        if (jomTxt) jomTxt.innerText = api.konstanty.dny_he_cz[denIndex];

        // 4. Hebrejské datum a písmo (přímo ze sekce "dnes" v API)
        const dateTxt = document.getElementById('h-date-txt');
        if (dateTxt) dateTxt.innerText = api.data.dnes.datum_he;

        const scriptTxt = document.getElementById('h-script-txt');
        if (scriptTxt) scriptTxt.innerText = api.data.dnes.script_he;

        // 5. Paraša - hledáme nejbližší sobotu
        let sabat = new Date(d);
        while (sabat.getDay() !== 6) {
            sabat.setDate(sabat.getDate() + 1);
        }
        const sKlic = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
        const parashaTxt = document.getElementById('parasha-txt');
        if (parashaTxt) {
            parashaTxt.innerText = api.data.parashot[sKlic] || "Paraša bude doplněna.";
        }

        // 6. Svátek nebo událost
        const dKlic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        const eventTxt = document.getElementById('event-txt');
        if (eventTxt) {
            if (api.data.svatky[dKlic]) {
                eventTxt.innerText = api.data.svatky[dKlic];
            } else {
                eventTxt.innerText = "Dnes není žádný významný svátek.";
            }
        }

    } catch (error) {
        console.error("Chyba v zid-kalendar.js:", error);
        // Pokud dojde k chybě, zobrazíme to uživateli
        const jomTxt = document.getElementById('jom-txt');
        if (jomTxt) jomTxt.innerText = "Chyba načítání dat";
    }
}

// Funkce pro sdílení
function shareJewishDay() {
    const msg = `🇮🇱 Židovský kalendář - Haifa\n\n` +
                `${document.getElementById('jom-txt').innerText}\n` +
                `${document.getElementById('h-date-txt').innerText}\n` +
                `${document.getElementById('h-script-txt').innerText}\n\n` +
                `📖 Paraša: ${document.getElementById('parasha-txt').innerText}\n` +
                `✨ Svátek: ${document.getElementById('event-txt').innerText}`;
    
    if (navigator.share) {
        navigator.share({ text: msg });
    } else {
        alert(msg);
    }
}

window.onload = init;
