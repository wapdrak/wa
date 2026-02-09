async function init() {
    try {
        // Načtení tvého vlastního API
        const res = await fetch('zid-kalendar.json');
        const api = await res.json();

        let d = new Date();
        // Haifa korekce: po 18:00 už je zítřek [cite: 2026-01-13]
        if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

        // 1. Den v týdnu
        document.getElementById('jom-txt').innerText = api.konstanty.dny_he_cz[d.getDay()];

        // 2. Výpočet hebrejského data (tvoje původní logika)
        const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
        const hParts = hFormat.formatToParts(d);
        const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
        
        let den, mesEn, rok;
        hParts.forEach(p => {
            if (p.type === 'day') den = p.value;
            if (p.type === 'month') mesEn = p.value;
            if (p.type === 'year') rok = p.value;
        });

        document.getElementById('h-date-txt').innerText = `${den}. ${api.konstanty.mesice_he_cz[mesEn] || mesEn} ${rok}`;
        document.getElementById('h-script-txt').innerText = hScript;

        // 3. Paraša (hledání nejbližší soboty v tvých datech)
        let sabat = new Date(d);
        while(sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
        const klic = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
        document.getElementById('parasha-txt').innerText = api.data.parashot[klic] || "Paraša bude doplněna.";

        // 4. Svátek
        const dKlic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        document.getElementById('event-txt').innerText = api.data.svatky[dKlic] || "Dnes není žádný významný svátek.";

    } catch (e) {
        console.error("Chyba:", e);
        document.getElementById('jom-txt').innerText = "Chyba načítání API";
    }
}

function shareJewishDay() {
    const msg = `🇮🇱 Židovský kalendář\n\n${document.getElementById('jom-txt').innerText}\n${document.getElementById('h-date-txt').innerText}\n${document.getElementById('h-script-txt').innerText}\n\n📖 Parašat HaŠavua:\n${document.getElementById('parasha-txt').innerText}\n\n✨ Svátek:\n${document.getElementById('event-txt').innerText}\n\n${document.getElementById('custom-msg').value}`;
    if (navigator.share) navigator.share({ text: msg }); else alert(msg);
}

window.onload = init;
