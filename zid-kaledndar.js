async function init() {
    const res = await fetch('zid-kalendar.json');
    const api = await res.json();
    
    let d = new Date();
    if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

    document.getElementById('jom-txt').innerText = api.konstanty.dny_cz[d.getDay()];
    document.getElementById('h-date-txt').innerText = api.data.dnes.datum_he;
    document.getElementById('h-script-txt').innerText = api.data.dnes.script_he;

    const klic = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    document.getElementById('event-txt').innerText = api.data.svatky[klic] || "Dnes není žádný významný svátek.";
}
window.onload = init;
