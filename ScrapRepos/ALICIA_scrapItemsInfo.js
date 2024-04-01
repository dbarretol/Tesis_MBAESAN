const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Definición de las rutas de los archivos como variables globales
const URLS_FILE = 'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\ALICIA_consolidado.txt';
const OUTPUT_FILE = 'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\RawItemData\\ALICIA_ItemsInfo.json';

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(`Visitando la url: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        let title = document.querySelector('h1[property="name"]').innerText;
        let metadata = { 'Título:': title, 'URL:': window.location.href };

        let table = document.querySelector('tbody');
        let rows = Array.from(table.querySelectorAll('tr'));

        rows.forEach(row => {
            let label = row.querySelector('th').innerText.trim();

            if (label === 'Autores:') {
                let authors = Array.from(row.querySelectorAll('a')).map(a => a.innerText.trim());
                metadata['Autor:'] = authors.join(';');
            } else {
                let value = row.querySelector('td').innerText.trim();
                metadata[label] = value;
            }
        });

        return metadata;
    });

    await browser.close();
    return data;
}

async function main() {
    let urls = fs.readFileSync(URLS_FILE, 'utf-8').split('\n');
    let results = [];

    for (let url of urls) {
        let data = await scrape(url);
        results.push(data);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
}

main();