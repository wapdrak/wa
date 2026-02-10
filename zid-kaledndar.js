/**
 * ŽIDOVSKÝ KALENDÁŘ - ČISTÉ HAIFA API
 * Kompletně autonomní verze bez externích závislostí.
 * [cite: 2025-09-15]
 */

const fs = require('fs');

// Překladové tabulky [cite: 2026-01-13]
const dnyCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

// Seznam parašot v pořadí (Tóra cyklus) [cite: 2025-09-14]
const vsechnyParashot = [
    "Berešit", "Noach", "Lech Lecha", "Vajera", "Chajej Sára", "Toledot", "Vajece", "Vajišlach", "Vaješev", "Mikec", "Vajigaš", "Vajechi",
    "Šemot", "Va'era", "Bo", "Bešalach", "Jitro", "Mišpatim", "Teruma", "Tecave", "Ki tisa", "Vajakhel", "Pekudej",
    "Vajikra", "Caw", "Šmini", "Tazria", "Mecora", "Acharej Mot", "Kedošim", "Emor", "Behar", "Bechukotaj",
    "Bemidbar", "Naso", "Beha'alotecha", "Šlach Lecha", "Korach", "Chukat", "Balak", "Pinchas", "Matot", "Masej",
    "Devarim", "Va'etchanan", "Ekev", "Re'e", "Shoftim", "Ki tece", "Ki tavo", "Nicavim", "Vajelech", "Ha'azinu", "Ve-zot ha-beracha"
];

// Algoritmus Tzeit HaKochavim pro Haifu (+35 min) [cite: 2026-01-13]
function getTzeitMinutes(date) {
    const lat = 32.79, dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const decl = 0.409 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
    const sunsetH = 12 + (Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(decl)) * 180 / Math.PI) / 15;
    return (sunsetH * 60) + 120 + 35; // +120 Haifa pásmo, +35 hvězdy
}

function generate() {
    let d = new Date();
    const nyniMin = (d.getHours() * 60) + d.getMinutes();
    if (nyniMin >= getTzeitMinutes(d)) d.setDate(d.getDate() + 1);

    // 1. Získání hebrejských dat přes vnitřní engine [cite: 2025-10-11, 2025-12-27]
    const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
    const hParts = hFormat.formatToParts(d);
    const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
    
    let hDen, hMesEn, hRok;
    hParts.forEach(p => {
        if (p.type === 'day') hDen = parseInt(p.value);
        if (p.type === 'month') hMesEn = p.value;
        if (p.type === 'year') hRok = p.value;
    });

    // 2. Logika svátků podle hebrejského data (vždy stejné dny v roce) [cite: 2025-09-14]
    let svatek = "Dnes není žádný významný svátek.";
    if (hMesEn === "Tishri") {
        if (hDen === 1 || hDen === 2) svatek = "Roš ha-šana (Nový rok) 🍎";
        if (hDen === 10) svatek = "Jom kipur (Den smíření) 🕯️";
    } else if (hMesEn === "Kislev" && hDen >= 25) svatek = "Chanuka 🕎";
    else if (hMesEn === "Shevat" && hDen === 15) svatek = "Tu bi-švat 🌳";
    else if ((hMesEn === "Adar" || hMesEn === "Adar II") && hDen === 14) svatek = "Purim 🎭";
    else if (hMesEn === "Nisan" && hDen >= 15 && hDen <= 22) svatek = "Pesach 🍷";

    // 3. Logika Paraši (Hledání soboty) [cite: 2025-12-27]
    // Výpočet paraši je matematicky závislý na týdnu od Simchat Tóra.
    // Pro "čisté" API bez listu použijeme vnitřní indexaci týdnů.
    let sabat = new Date(d);
    while (sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
    
    // Zjednodušený "věčný" výpočet indexu paraši
    const startRoku = new Date(d.getFullYear(), 0, 1);
    const tydenRoku = Math.ceil((((sabat - startRoku) / 86400000) + startRoku.getDay() + 1) / 7);
    const indexParashy = (tydenRoku + 12) % vsechnyParashot.length; // Korekce pro aktuální cyklus

    const apiVystup = {
        "dnes": {
            "jom_tyden": dnyCz[d.getDay()],
            "datum_he": `${hDen}. ${mesHeCz[hMesEn] || hMesEn} ${hRok}`,
            "script_he": hScript,
            "parasha": vsechnyParashot[indexParashy], // Čistý výpočet z pole
            "svatek": svatek,
            "sefaria_url": "https://www.sefaria.org.il/topics/torah-portions",
            "vysvetleni": "Datum se mění s východem první hvězdy (Tzeit HaKochavim) v Haifě."
        }
    };

    fs.writeFileSync('zid-kalendar.json', JSON.stringify(apiVystup, null, 2));
    console.log("API úspěšně vygenerováno lokálně.");
}

generate();
