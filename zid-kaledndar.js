// wa/zid-kalendar.js
async function init() {
    try {
        const res = await fetch('zid-kalendar.json');
        const api = await res.json();

        let d = new Date();
        // Haifa logika: po 18:00 už je zítřek
        if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

        document.getElementById('jom-txt').innerText = api.konstanty.dny_he_cz[d.getDay()];

        const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
        const hParts = hFormat.formatToParts(d);
        
        let den, mesEn, rok;
        hParts.forEach(p => {
            if (p.type === 'day') den = p.value;
            if (p.type === 'month') mesEn = p.value;
            if (p.type === 'year') rok = p.value;
        });

        const mesice = api.konstanty.mesice_he_cz;
        document.getElementById('h-date-txt').innerText = den + ". " + (mesice[mesEn] || mesEn) + " " + rok;

        // Ostatní tvoje logika (paraša, svátky...)
        // ...
    } catch (error) {
        console.error("Chyba při načítání API:", error);
    }
}

// Funkce pro sdílení zůstává stejná
function shareJewishDay() {
    // ... tvůj kód pro sdílení ...
}

window.onload = init;
