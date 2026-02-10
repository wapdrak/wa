// Upravená část v api-generator.js
function generate() {
    let d = new Date();
    // Pokud je po hvězdách, posuneme na židovský zítřek [cite: 2026-01-13]
    // (Předpokládejme tvou funkci getTzeitInHaifa nebo zjednodušený posun)
    
    // Najdeme nejbližší sobotu pro klíč paraši
    let sabat = new Date(d);
    while(sabat.getDay() !== 6) {
        sabat.setDate(sabat.getDate() + 1);
    }
    const klicSabat = `${sabat.getDate()}.${sabat.getMonth() + 1}.${sabat.getFullYear()}`;
    const klicDnes = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

    const apiVystup = {
        "dnes": {
            "jom_tyden": dnyHeCz[d.getDay()],
            "datum_he": hFormat.format(d),
            "script_he": hScript,
            "parasha": parashot[klicSabat] || "Paraša bude doplněna.", // Hledá sobotu!
            "svatek": svatky[klicDnes] || "Dnes není žádný významný svátek." // Hledá dnešek!
        }
    };
    // ... zbytek kódu pro zápis souboru
}
