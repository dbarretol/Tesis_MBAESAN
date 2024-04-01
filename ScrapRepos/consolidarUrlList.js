const fs = require('fs');

// Función para leer un archivo y extraer las URLs
function readAndExtractUrls(path) {
    let file = fs.readFileSync(path, 'utf-8');
    return file.split('\n').map(line => line.split('\t')[1]);
}

// Función para unir dos listas de URLs y eliminar duplicados
function consolidateUrls(urls1, urls2) {
    return [...new Set([...urls1, ...urls2])];
}

// Función para guardar las URLs en un archivo
function saveUrls(urls, path) {
    fs.writeFileSync(path, urls.join('\n'));
}

// Función para procesar dos archivos y guardar los resultados en un archivo de salida
function processFiles(path1, path2, outputPath) {
    let urls1 = readAndExtractUrls(path1);
    let urls2 = readAndExtractUrls(path2);
    let allUrls = consolidateUrls(urls1, urls2);
    saveUrls(allUrls, outputPath);
}

// Procesar los archivos ALICIA
processFiles(
    'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\ALICIA-ItemUrlList-{costa afuera}.txt',
    'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\ALICIA-ItemUrlList-{offshore}.txt',
    'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\ALICIA_consolidado.txt'
);

// Procesar los archivos RENATI
processFiles(
    'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\RENATI-ItemUrlList-{costa afuera}.txt',
    'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\RENATI-ItemUrlList-{offshore}.txt',
    'C:\\D_DevBox\\TESIS_MBA\\ScrapRepos\\Items_urlList\\RENATI_consolidado.txt'
);