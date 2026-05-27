// Install: npm install puppeteer

// backend/services/scraper.js
import puppeteer from 'puppeteer';

export const scrapeImages = async (url, maxImages = 10) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const images = await page.evaluate((max) => {
    const imgElements = document.querySelectorAll('img');
    return Array.from(imgElements)
      .slice(0, max)
      .map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
      }));
  }, maxImages);
  
  await browser.close();
  return images;
};