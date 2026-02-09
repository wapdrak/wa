const dnyHeCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

async function init() {
    try {
        // Načtení tvého vlastního API (JSON souboru)
        const response = await fetch('zid-kalendar.json?v=' + Date.now());
        const api = await response.json();

        let d = new Date();
        // Korekce Haifa: po 18:00 už je zítřek [cite: 2026-01-13]
        if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

        document.getElementById('jom-txt').innerText = dnyHeCz[d.getDay()];

        // Tvá původní logika s Intl.DateTimeFormat
        const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
        const hParts = hFormat.formatToParts(d);
        const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
        
        let den, mesEn, rok;
        hParts.forEach(p => {
            if (p.type === 'day') den = p.value;
            if (p.type === 'month') mesEn = p.value;
            if (p.type === 'year') rok = p.value;
        });

        document.getElementById('h-date-txt').innerText = `${den}. ${mesHeCz[mesEn] || mesEn} ${rok}`;
        document.getElementById('h-script-txt').innerText = hScript;

        // Paraša - najdeme nejbližší sobotu v tvém JSONu
        let sabat = new Date(d);
        while(sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
        const klic = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
        document.getElementById('parasha-txt').innerText = api.parashot[klic] || "Paraša bude doplněna.";

        // Svátek z tvého JSONu
        const dKlic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        document.getElementById('event-txt').innerText = api.svatky[dKlic] || "Dnes není žádný významný svátek.";

    } catch (e) {
        console.error("Chyba:", e);
        document.getElementById('jom-txt').innerText = "Chyba načítání dat";
    }
}

function shareJewishDay() {
    const msg = `🇮🇱 Židovský kalendář\n\n${document.getElementById('jom-txt').innerText}\n${document.getElementById('h-date-txt').innerText}\n${document.getElementById('h-script-txt').innerText}\n\n📖 Parašat HaŠavua:\n${document.getElementById('parasha-txt').innerText}\n\n✨ Svátek:\n${document.getElementById('event-txt').innerText}\n\n${document.getElementById('custom-msg').value}`;
    if (navigator.share) navigator.share({ text: msg }); else alert(msg);
}
window.onload = init;
