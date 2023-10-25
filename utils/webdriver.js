const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const puppeteer = require('puppeteer');


const fetchHtml = async (url, config = {}) => {
    const screen = {
        width: 640,
        height: 480
      };
    let driver 
    if(config.isHeadless) {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();
    }
    else {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().windowSize(screen)).build();
    }


    await driver.get(url)
    const rawHtml = await driver.getPageSource();

    driver.quit();
    return rawHtml
}

const fetchSsrHtml = async (url, config = {}) => {
    const headless = config.isHeadless ? true : false
    const browser = await puppeteer.launch({
      headless
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.resourceType() === 'script') {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(url);
    const rawHtml = await page.content();
    await browser.close();
    return rawHtml
}

module.exports = {
    fetchHtml,
    fetchSsrHtml
}