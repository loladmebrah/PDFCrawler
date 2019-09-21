const request = require('request');
var rootCas = require('ssl-root-cas/latest').create();
const fs = require('fs');
const url = 'http://www.fidupopular.com.co/wps/wcm/connect/fiduciaria-popular/99cd1479-643a-4195-bbeb-68d098e094f0/FT-Rentar-agosto-2019.pdf?MOD=AJPERES';
//const url = 'https://www.ad-cap.com.co/?wpfb_dl=1267';

(async () => {
    let file = fs.createWriteStream('binarypdf.pdf');
    await new Promise((resolve, reject)=>{
        let stream = request({uri: url,
            "rejectUnauthorized": false,  
            headers:{
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }
        }).pipe(file)
        .on('finish', ()=>{
            console.log('finished downloading');
            resolve(true);
        })
        .on('error', (error)=>{
            console.log("we failed", error);
            reject(error);
        })
    })
    .catch(error=>{
        console.log(`we failed: ${error}`);
    })
})();