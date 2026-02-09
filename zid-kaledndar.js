const dnyHeCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

async function init() {
    // A. LOKÁLNÍ VÝPOČET (To, co Pixel umí hned)
    let d = new Date();
    if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

    // Vložení dne v týdnu
    document.getElementById('jom-txt').innerText = dnyHeCz[d.getDay()];

    // Výpočet hebrejského data
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

    // B. NAČTENÍ TVÉHO API (To, co se může zaseknout)
    try {
        const response = await fetch('zid-kalendar.json?v=' + Date.now());
        if (!response.ok) throw new Error('JSON nenalezen');
        const api = await response.json();

        // Paraša (nejbližší sobota)
        let sabat = new Date(d);
        while(sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
        const klic = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
        document.getElementById('parasha-txt').innerText = api.parashot[klic] || "Paraša bude doplněna.";

        // Svátek
        const dKlic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        if (api.svatky[dKlic]) {
            document.getElementById('event-txt').innerText = api.svatky[dKlic];
        } else {
            document.getElementById('event-txt').innerText = "Dnes není žádný významný svátek.";
        }
    } catch (e) {
        console.error("API zatím není dostupné:", e);
        document.getElementById('parasha-txt').innerText = "Data z API nedostupná";
    }
}

function shareJewishDay() {
    const msg = `🇮🇱 Židovský kalendář\n\n${document.getElementById('jom-txt').innerText}\n${document.getElementById('h-date-txt').innerText}\n${document.getElementById('h-script-txt').innerText}\n\n📖 Parašat HaŠavua:\n${document.getElementById('parasha-txt').innerText}\n\n✨ Svátek:\n${document.getElementById('event-txt').innerText}\n\n${document.getElementById('custom-msg').value}`;
    if (navigator.share) navigator.share({ text: msg }); else alert(msg);
}

window.onload = init;
