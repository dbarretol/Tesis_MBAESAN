const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const URLS_FILE = 'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\RENATI_consolidado.txt';
const OUTPUT_FILE = 'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\RawItemData\\RENATI_ItemsInfo.json';

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(`Visitando la url: ${url}`);
    await page.goto(url, {waitUntil: 'networkidle2'});

    const data = await page.evaluate(() => {
        let metadata = {};
        const metadataFields = document.querySelectorAll('.metadataField');
        metadataFields.forEach(field => {
            const label = field.querySelector('.metadataFieldLabel').innerText.trim();
            const value = field.querySelector('.metadataFieldValue').innerText.trim();
            metadata[label] = value;
        });
        return metadata;
    });

    await browser.close();
    return data;
}

async function main() {
    const urls = (await readFile(URLS_FILE, 'utf-8')).split('\n');
    const results = [];

    for (let url of urls) {
        const data = await scrape(url);
        results.push(data);
    }

    await writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
}

main().catch(console.error);