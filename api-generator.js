const fs = require('fs');

// Tvá data pro rok 2026 [cite: 2025-09-14]
const svatky = {"2.2.2026":"Tu Bi-švat 🌳", "3.3.2026":"Půst Ester", "4.3.2026":"Purim 🎭", "1.4.2026":"Erev Pesach 🍷"};
const parashot = {"14.2.2026":"Jitro (יִתְרוֹ)", "21.2.2026":"Mišpatim (מִשְׁפָּטִים)", "28.2.2026":"Teruma (תְּרוּMָה)"};
const dnyHeCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];

function generate() {
    let d = new Date();
    // Haifa logika pro Tzeit HaKochavim [cite: 2026-01-13]
    // (Zde je zjednodušený výpočet pro server, aby byl JSON vždy čerstvý)
    
    const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
    const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
    
    let klic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    
    const apiVystup = {
        dnes: {
            jom_tyden: dnyHeCz[d.getDay()],
            datum_he: hFormat.format(d),
            script_he: hScript,
            parasa: parashot[klic] || "Paraša bude doplněna.",
            svatek: svatky[klic] || "Dnes není žádný významný svátek."
        }
    };

    fs.writeFileSync('zid-kalendar.json', JSON.stringify(apiVystup, null, 2));
}

generate();
