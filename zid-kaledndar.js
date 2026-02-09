async function init() {
    try {
        // 1. Načtení dat z tvého vlastního API
        // Používáme await, aby skript počkal, dokud se soubor nestáhne
        const res = await fetch('zid-kalendar.json');
        if (!res.ok) throw new Error('Soubor zid-kalendar.json nebyl nalezen.');
        const api = await res.json();

        // 2. Časová logika pro Haifu (po 18:00 už je zítřek)
        let d = new Date();
        if (d.getHours() >= 18) {
            d.setDate(d.getDate() + 1);
        }

        // 3. Den v týdnu - bereme z tvého pole konstant v JSONu
        const denIndex = d.getDay(); // 0 = Neděle
        const jomElement = document.getElementById('jom-txt');
        if (jomElement) {
            jomElement.innerText = api.konstanty.dny_he_cz[denIndex];
        }

        // 4. Hebrejské datum a písmo (přímo ze sekce "dnes" v tvém API)
        const hDateElement = document.getElementById('h-date-txt');
        if (hDateElement) {
            hDateElement.innerText = api.data.dnes.datum_he;
        }

        const hScriptElement = document.getElementById('h-script-txt');
        if (hScriptElement) {
            hScriptElement.innerText = api.data.dnes.script_he;
        }

        // 5. Paraša - najdeme nejbližší sobotu
        let sabat = new Date(d);
        while (sabat.getDay() !== 6) {
            sabat.setDate(sabat.getDate() + 1);
        }
        const sKlic = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
        
        const parashaElement = document.getElementById('parasha-txt');
        if (parashaElement) {
            parashaElement.innerText = api.data.parashot[sKlic] || "Paraša bude doplněna.";
        }

        // 6. Svátek nebo událost pro dnešní den
        const dKlic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        const eventElement = document.getElementById('event-txt');
        if (eventElement) {
            if (api.data.svatky[dKlic]) {
                eventElement.innerText = api.data.svatky[dKlic];
            } else {
                eventElement.innerText = "Dnes není žádný významný svátek.";
            }
        }

    } catch (error) {
        console.error("Chyba v zid-kalendar.js:", error);
        // Pokud dojde k chybě, informujeme uživatele přímo na stránce
        document.getElementById('jom-txt').innerText = "Chyba načítání dat";
        document.getElementById('parasha-txt').innerText = "Zkontrolujte zdrojový JSON";
    }
}

// Funkce pro sdílení dat, kterou máš v HTML tlačítku
function shareJewishDay() {
    const jom = document.getElementById('jom-txt').innerText;
    const date = document.getElementById('h-date-txt').innerText;
    const script = document.getElementById('h-script-txt').innerText;
    const parasha = document.getElementById('parasha-txt').innerText;
    const event = document.getElementById('event-txt').innerText;
    
    const msg = `🇮🇱 Židovský kalendář - Haifa\n\n${jom}\n${date}\n${script}\n\n📖 Paraša: ${parasha}\n✨ Svátek: ${event}`;
    
    if (navigator.share) {
        navigator.share({ text: msg });
    } else {
        alert(msg);
    }
}

// Spuštění po načtení stránky
window.onload = init;
