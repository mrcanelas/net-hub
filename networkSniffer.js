const puppeteer = require('puppeteer');
const { GoogleVideoExtractor } = require('./src/extractors/googlevideo');

async function captureRequests(url) {
    // Iniciar o navegador
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Habilitar o monitoramento de requisições de rede
    await page.setRequestInterception(true);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
        'Referer': 'https://www.hentaitube.online/',
    });
    await page.setViewport({ width: 1366, height: 768 });

    // Capturar todas as requisições de rede
    const requests = [];
    page.on('request', (request) => {
        requests.push(request.url());
        request.continue();
    });

    // Navegar até a página e esperar o carregamento completo
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Executar algum JavaScript na página se necessário
    // await page.evaluate(() => {
    //     // Seu código JavaScript aqui
    // });

    // Fechar o navegador
    await browser.close();

    // Imprimir as requisições capturadas
    console.log('Requisições feitas pela página:', requests);
}

// URL da página que você quer analisar
const url = 'https://rr3---sn-vgqsknzz.googlevideo.com/videoplayback?expire=1713606096&ei=UB0jZsnWA5rn-LYPyNiASA&ip=209.126.108.26&id=bd18c80823696edb&itag=22&source=blogger&xpc=Egho7Zf3LnoBAQ%3D%3D&mh=fi&mm=31&mn=sn-vgqsknzz&ms=au&mv=m&mvi=3&pl=21&susc=bl&eaua=53rggbYPIa8&mime=video/mp4&vprv=1&dur=400.753&lmt=1667922686613554&mt=1713577034&txp=1311224&sparams=expire,ei,ip,id,itag,source,xpc,susc,eaua,mime,vprv,dur,lmt&sig=AJfQdSswRAIgJwOqlQfSxpb6E-2pSdNtmtnDksIhcSI-bncpqcnDodYCIBtkq45C2lQKnGHrjtNZwY68B-aw7IGi-35sU5jE8ZRv&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=ALClDIEwRAIgOStXlVzgcuC2qduq3BulqLM5nSheD4ReWpv2HUGwjigCICMJ7NvhvQRmMfFH1Tp6pNGv1kUEBAdKSULrTl54N66V';
//captureRequests(url);
GoogleVideoExtractor(url).then(console.log)

//https://rr3---sn-vgqsknzz.googlevideo.com/videoplayback?expire=1713606096&ei=UB0jZsnWA5rn-LYPyNiASA&ip=209.126.108.26&id=bd18c80823696edb&itag=22&source=blogger&xpc=Egho7Zf3LnoBAQ%3D%3D&mh=fi&mm=31&mn=sn-vgqsknzz&ms=au&mv=m&mvi=3&pl=21&susc=bl&eaua=53rggbYPIa8&mime=video/mp4&vprv=1&dur=400.753&lmt=1667922686613554&mt=1713577034&txp=1311224&sparams=expire,ei,ip,id,itag,source,xpc,susc,eaua,mime,vprv,dur,lmt&sig=AJfQdSswRAIgJwOqlQfSxpb6E-2pSdNtmtnDksIhcSI-bncpqcnDodYCIBtkq45C2lQKnGHrjtNZwY68B-aw7IGi-35sU5jE8ZRv&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=ALClDIEwRAIgOStXlVzgcuC2qduq3BulqLM5nSheD4ReWpv2HUGwjigCICMJ7NvhvQRmMfFH1Tp6pNGv1kUEBAdKSULrTl54N66V
//https://rr3---sn-vgqsknzz.googlevideo.com/videoplayback?expire=1713606096&ei=UB0jZsnWA5rn-LYPyNiASA&ip=209.126.108.26&id=bd18c80823696edb&itag=22&source=blogger&xpc=Egho7Zf3LnoBAQ%3D%3D&mh=fi&mm=31&mn=sn-vgqsknzz&ms=au&mv=m&mvi=3&pl=21&susc=bl&eaua=53rggbYPIa8&mime=video/mp4&vprv=1&dur=400.753&lmt=1667922686613554&mt=1713577034&txp=1311224&sparams=expire,ei,ip,id,itag,source,xpc,susc,eaua,mime,vprv,dur,lmt&sig=AJfQdSswRAIgJwOqlQfSxpb6E-2pSdNtmtnDksIhcSI-bncpqcnDodYCIBtkq45C2lQKnGHrjtNZwY68B-aw7IGi-35sU5jE8ZRv&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=ALClDIEwRAIgOStXlVzgcuC2qduq3BulqLM5nSheD4ReWpv2HUGwjigCICMJ7NvhvQRmMfFH1Tp6pNGv1kUEBAdKSULrTl54N66V
//https://rr1---sn-uxap0hoxufvg3n-bg0l.googlevideo.com/videoplayback?expire=1713606096&ei=UB0jZsnWA5rn-LYPyNiASA&ip=209.126.108.26&id=bd18c80823696edb&itag=22&source=blogger&xpc=Egho7Zf3LnoBAQ%3D%3D&susc=bl&eaua=53rggbYPIa8&mime=video/mp4&vprv=1&dur=400.753&lmt=1667922686613554&txp=1311224&sparams=expire,ei,ip,id,itag,source,xpc,susc,eaua,mime,vprv,dur,lmt&sig=AJfQdSswRAIgJwOqlQfSxpb6E-2pSdNtmtnDksIhcSI-bncpqcnDodYCIBtkq45C2lQKnGHrjtNZwY68B-aw7IGi-35sU5jE8ZRv&redirect_counter=1&rm=sn-vgqe6z7s&req_id=7c6b4651fa97a3ee&cms_redirect=yes&cmsv=e&ipbypass=yes&mh=fi&mip=45.227.66.246&mm=31&mn=sn-uxap0hoxufvg3n-bg0l&ms=au&mt=1713576932&mv=u&mvi=1&pcm2cms=yes&pl=24&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl&lsig=ALClDIEwRQIhANN4VAjW8-EmnDc_T5--3AripEo2oWhki0iXWJZmWaIYAiAMfFSGOCLVEkCrqNXiBRr_eQG7nuTxX01A5Ov34h7Y1Q%3D%3D
//https://rr1---sn-uxap0hoxufvg3n-bg0l.googlevideo.com/videoplayback?expire=1713606096&ei=UB0jZsnWA5rn-LYPyNiASA&ip=209.126.108.26&id=bd18c80823696edb&itag=22&source=blogger&xpc=Egho7Zf3LnoBAQ%3D%3D&susc=bl&eaua=53rggbYPIa8&mime=video/mp4&vprv=1&dur=400.753&lmt=1667922686613554&txp=1311224&sparams=expire,ei,ip,id,itag,source,xpc,susc,eaua,mime,vprv,dur,lmt&sig=AJfQdSswRAIgJwOqlQfSxpb6E-2pSdNtmtnDksIhcSI-bncpqcnDodYCIBtkq45C2lQKnGHrjtNZwY68B-aw7IGi-35sU5jE8ZRv&redirect_counter=1&rm=sn-vgqe6z7s&req_id=6c1a05f5f9fca3ee&cms_redirect=yes&cmsv=e&ipbypass=yes&mh=fi&mip=45.227.66.246&mm=31&mn=sn-uxap0hoxufvg3n-bg0l&ms=au&mt=1713576932&mv=u&mvi=1&pcm2cms=yes&pl=24&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl&lsig=ALClDIEwRQIhAPR11c1wcqWOn_Noy4TDV4C_LYVC0FDjEAd9xYptdqyEAiAMXbh-CaCaH2Q9Au1Lz8IIAaPJNVO8E2Ue-Clce_s2Sw%3D%3D
//https://rr3---sn-vgqsknzz.googlevideo.com/videoplayback?expire=1713606096&ei=UB0jZsnWA5rn-LYPyNiASA&ip=209.126.108.26&id=bd18c80823696edb&itag=22&source=blogger&xpc=Egho7Zf3LnoBAQ%3D%3D&mh=fi&mm=31&mn=sn-vgqsknzz&ms=au&mv=m&mvi=3&pl=21&susc=bl&eaua=53rggbYPIa8&mime=video/mp4&vprv=1&dur=400.753&lmt=1667922686613554&mt=1713577034&txp=1311224&sparams=expire,ei,ip,id,itag,source,xpc,susc,eaua,mime,vprv,dur,lmt&sig=AJfQdSswRAIgJwOqlQfSxpb6E-2pSdNtmtnDksIhcSI-bncpqcnDodYCIBtkq45C2lQKnGHrjtNZwY68B-aw7IGi-35sU5jE8ZRv&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=ALClDIEwRAIgOStXlVzgcuC2qduq3BulqLM5nSheD4ReWpv2HUGwjigCICMJ7NvhvQRmMfFH1Tp6pNGv1kUEBAdKSULrTl54N66V