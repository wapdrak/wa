/**
 * ŽIDOVSKÝ KALENDÁŘ - ČISTÉ HAIFA API (VĚČNÁ VERZE)
 * Autonomní generátor JSON pro MacroDroid a Web.
 * [cite: 2025-09-15]
 */

const fs = require('fs');

// 1. Kompletní cyklus parašot s hebrejskými názvy [cite: 2025-09-14]
const vsechnyParashot = [
    "Berešit (בְּרֵאשִׁית)", "Noach (נֹחַ)", "Lech Lecha (לֶךְ-לְךָ)", "Vajera (וַיֵּרָא)", "Chajej Sára (חַיֵּי שָׂרָה)", "Toledot (תּוֹלְדֹת)", "Vajece (וַיֵּצֵא)", "Vajišlach (וַיִּשְׁלַח)", "Vaješev (וַיֵּשֶׁב)", "Mikec (מִקֵּץ)", "Vajigaš (וַיִּגַּשׁ)", "Vajechi (וַיְחִי)",
    "Šemot (שְׁמוֹת)", "Va'era (וָאֵרָא)", "Bo (בֹּא)", "Bešalach (בְּשַׁלַּח)", "Jitro (יִתְרוֹ)", "Mišpatim (מִשְׁפָּטִים)", "Teruma (תְּרוּמָה)", "Tecave (תְּצַוֶּה)", "Ki tisa (כִּי תִשָּׂא)", "Vajakhel (וַיַּקְהֵל)", "Pekudej (פְקוּדֵי)",
    "Vajikra (וַיִּקְרָא)", "Caw (צַו)", "Šmini (שְּׁמִינִי)", "Tazria (תַזְרִיעַ)", "Mecora (מְּצֹרָע)", "Acharej Mot (אַחֲרֵי מוֹת)", "Kedošim (קְדֹשִׁים)", "Emor (אֱמֹר)", "Behar (בְּהַר)", "Bechukotaj (בְּחֻקֹּתַי)",
    "Bemidbar (בְּמִדְבַּר)", "Naso (נָשֹׂא)", "Beha'alotecha (בְּהַעֲלֹתְךָ)", "Šlach Lecha (שְׁלַח-לְךָ)", "Korach (קֹרַח)", "Chukat (חֻקַּת)", "Balak (בָּלָק)", "Pinchas (פִּינְחָס)", "Matot (מַטּוֹת)", "Masej (מַסְעֵי)",
    "Devarim (דְּבָרִים)", "Va'etchanan (וָאֶתְחַנַּן)", "Ekev (עֵקֶב)", "Re'e (רְאֵה)", "Shoftim (שֹׁפְטִים)", "Ki tece (כִּי-תֵצֵא)", "Ki tavo (כִּי-תָבוֹא)", "Nicavim (נִצָּבִים)", "Vajelech (וַיֵּלֶךְ)", "Ha'azinu (הַאֲזִינוּ)", "Ve-zot ha-beracha (וְזֹאת הַבְּרָכָה)"
];

const dnyCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

// 2. Astronomický výpočet hvězd pro Haifu [cite: 2026-01-13]
function getTzeitMinutes(date) {
    const lat = 32.79, dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const decl = 0.409 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
    const sunsetH = 12 + (Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(decl)) * 180 / Math.PI) / 15;
    return (sunsetH * 60) + 120 + 35; // +120 Haifa, +35 hvězdy
}

function generate() {
    let d = new Date();
    const nyniMin = (d.getHours() * 60) + d.getMinutes();
    if (nyniMin >= getTzeitMinutes(d)) d.setDate(d.getDate() + 1);

    // 3. Hebrejské datum přes vnitřní engine [cite: 2025-10-11, 2025-12-27]
    const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
    const hParts = hFormat.formatToParts(d);
    const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
    
    let hDen, hMesEn, hRok;
    hParts.forEach(p => {
        if (p.type === 'day') hDen = parseInt(p.value);
        if (p.type === 'month') hMesEn = p.value;
        if (p.type === 'year') hRok = p.value;
    });

    // 4. Logika svátků [cite: 2025-09-14]
    let svatek = "Dnes není žádný významný svátek.";
    if (hMesEn === "Tishri") {
        if (hDen === 1 || hDen === 2) svatek = "Roš ha-šana (Nový rok) 🍎";
        if (hDen === 10) svatek = "Jom kipur (Den smíření) 🕯️";
    } else if (hMesEn === "Kislev" && hDen >= 25) svatek = "Chanuka 🕎";
    else if (hMesEn === "Shevat" && hDen === 15) svatek = "Tu bi-švat 🌳";
    else if ((hMesEn === "Adar" || hMesEn === "Adar II") && hDen === 14) svatek = "Purim 🎭";
    else if (hMesEn === "Nisan" && hDen >= 15 && hDen <= 22) svatek = "Pesach 🍷";

    // 5. Logika Paraši (Hledání soboty) [cite: 2025-12-27]
    let sabat = new Date(d);
    while (sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
    
    // Matematický odhad indexu paraši v cyklu
    const startRoku = new Date(d.getFullYear(), 0, 1);
    const tydenRoku = Math.ceil((((sabat - startRoku) / 86400000) + startRoku.getDay() + 1) / 7);
    const indexParashy = (tydenRoku + 13) % vsechnyParashot.length; 

    const apiVystup = {
        "dnes": {
            "jom_tyden": dnyCz[d.getDay()],
            "datum_he": `${hDen}. ${mesHeCz[hMesEn] || hMesEn} ${hRok}`,
            "script_he": hScript,
            "parasha": vsechnyParashot[indexParashy],
            "svatek": svatek,
            "sefaria_url": "https://www.sefaria.org.il/topics/torah-portions?sort=Relevance&tab=sources",
            "vysvetleni": "Datum se mění s východem první hvězdy (Tzeit HaKochavim) v Haifě, což znamená že nový den začíná již večer."
        }
    };

    fs.writeFileSync('zid-kalendar.json', JSON.stringify(apiVystup, null, 2));
}

generate();
