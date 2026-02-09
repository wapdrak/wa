const dnyHeCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

async function init() {
    // 1. OKAMŽITÝ VÝPOČET (Nepotřebuje internet)
    let d = new Date();
    // Haifa logika: po 18:00 už je zítřek [cite: 2026-01-13]
    if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

    // Vypsání dne v týdnu
    const jomElem = document.getElementById('jom-txt');
    if (jomElem) jomElem.innerText = dnyHeCz[d.getDay()];

    // Výpočet hebrejského data přímo v prohlížeči
    const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
    const hParts = hFormat.formatToParts(d);
    const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
    
    let den, mesEn, rok;
    hParts.forEach(p => {
        if (p.type === 'day') den = p.value;
        if (p.type === 'month') mesEn = p.value;
        if (p.type === 'year') rok = p.value;
    });

    const hDateElem = document.getElementById('h-date-txt');
    if (hDateElem) hDateElem.innerText = `${den}. ${mesHeCz[mesEn] || mesEn} ${rok}`;
    
    const hScriptElem = document.getElementById('h-script-txt');
    if (hScriptElem) hScriptElem.innerText = hScript;

    // 2. NAČTENÍ TVÉHO VLASTNÍHO API (Svátky a paraši)
    try {
        // Používáme timestamp ?v=, aby se obešla mezipaměť GitHubu [cite: 2025-09-11]
        const response = await fetch('zid-kalendar.json?v=' + Date.now());
        if (!response.ok) throw new Error('API JSON nenalezen');
        const api = await response.json();

        // Paraša (nejbližší sobota)
        let sabat = new Date(d);
        while(sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
        const klic = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
        
        const parashaElem = document.getElementById('parasha-txt');
        if (parashaElem) parashaElem.innerText = api.parashot[klic] || "Paraša bude doplněna.";

        // Svátek
        const dKlic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        const eventElem = document.getElementById('event-txt');
        if (eventElem) {
            eventElem.innerText = api.svatky[dKlic] || "Dnes není žádný významný svátek.";
        }
    } catch (e) {
        console.error("API Error:", e);
        // Pokud API selže, aspoň přepíšeme načítací texty
        document.getElementById('parasha-txt').innerText = "Data budou brzy doplněna.";
    }
}

function shareJewishDay() {
    const msg = `🇮🇱 Židovský kalendář\n\n${document.getElementById('jom-txt').innerText}\n${document.getElementById('h-date-txt').innerText}\n${document.getElementById('h-script-txt').innerText}\n\n📖 Parašat HaŠavua:\n${document.getElementById('parasha-txt').innerText}\n\n✨ Svátek:\n${document.getElementById('event-txt').innerText}\n\n${document.getElementById('custom-msg').value}`;
    if (navigator.share) navigator.share({ text: msg }); else alert(msg);
}

window.onload = init;
