//Visita cada pagina que contiene los resultados de la busqueda hecha en ALICIA y las guarda en un archivo consolidado

const fs = require('fs');
const puppeteer = require('puppeteer');

// Definir las rutas de los archivos como variables globales
const INPUT_FILE = './RawURLS/ALICIA - SL - {costa afuera}.txt';
const OUTPUT_FILE = 'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\ALICIA-ItemUrlList-{costa afuera}.txt';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 1. Leer los enlaces y guardarlos en una variable
    const data = fs.readFileSync(INPUT_FILE, 'utf8');
    const urls = data.split('\n').filter(url => url);

    let results = [];

    for (let url of urls) {
        // 2. Visitar enlace por enlace y esperar hasta que la página cargue completamente
        await page.goto(url, { waitUntil: 'networkidle0' });

        // 3. Capturar todos los elementos con tag 'a' y cuyo href inicie con '/vufind/Record/'
        const links = await page.$$eval('a[href^="/vufind/Record/"]', as => as.map(a => a.href.replace('/Save', '')));

        // Eliminar elementos repetidos
        const uniqueLinks = [...new Set(links)];

        // Guardar cada url original y las href correspondientes obtenidas en un formato específico
        uniqueLinks.forEach(link => {
            results.push(`${url.trim()}\t${link.trim()}`);
        });
    }

    // 4. Guardar las URLs en un archivo txt
    fs.writeFileSync(OUTPUT_FILE, results.join('\n'));

    await browser.close();
})();