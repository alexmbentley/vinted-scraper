import puppeteer from "puppeteer";



const url = 'https://www.vinted.co.uk/catalog?search_text=nike%20joggers&time=1740307282&order=newest_first&page=1';

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: 'screenshot.png'});
    await page.waitForSelector('.feed-grid__item', { timeout: 5_000 });

    const allItems = await page.evaluate(() => {
        const items = document.querySelectorAll('.feed-grid__item')
        
        return Array.from(items).map((item) => {
            const info = item.querySelector('.new-item-box__overlay--clickable')?.title;
            const image = item.querySelector('.web_ui__Image__content')?.src;
            const link = item.querySelector('.new-item-box__overlay--clickable')?.href;
            const regex = /^(?<description>.*?),\s*brand:.*?size:\s*(?<size>[^,]+).*?£(?<price>[\d.]+),\s*£[\d.]+\s+includes\s+Buyer\s+Protection/;
            const match = info.match(regex);
            if (match?.groups) {
                const description = match.groups.description
                const size = match.groups.size;
                const price = match.groups.price;
                return {description, size, price, image, link};
            }
           
        })
    })
    console.log(allItems);
    await browser.close();
}

main();