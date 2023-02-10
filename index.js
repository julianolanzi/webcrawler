const axios = require('axios');
const cheerio = require('cheerio');
const pup = require('puppeteer');
const fs = require('fs').promises;

const url = 'https://www.itau.com.br/';
const UrlsArray = require('./urls.json');
let c = 1;

const allCookies = [];
// async function getCookies(){
//     const data =  await axios.get(url);
// }

// getCookies();

(async () => {
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForTimeout(3000);

    await page.click('button.btn-marco-civil');

    await page.waitForTimeout(3000);

    const urls = await page.$$eval('.common-link__item > a', (el) => {
        const urls = el.map((a) => a.getAttribute("href"));
        return urls;
    });
    await fs.writeFile('./urls.json', JSON.stringify(urls));


    for (const url of UrlsArray) {
       
        url.trim();

        console.log(url);

        console.log('pagina' + url + c);
        await page.goto(url);
        await page.waitForTimeout(5000);

        const cookies = await page.cookies();
        
        let nameUrl = url.split('/');
        console.log(nameUrl);
        let numberUrl = nameUrl.length;
        console.log(nameUrl.length);
        let finish = nameUrl.substring(0, numberUrl);
        console.log(finish);


        await fs.writeFile(`./${url.trim()}.json`, JSON.stringify(cookies, null, 2));

        c++;
    }



    await page.waitForTimeout(3000);
    await fs.writeFile('./AllCookies.json', JSON.stringify(allCookies, null, 2));
    // const cookies = await page.cookies();
    // console.log(cookies.length);


    await browser.close();
})();