import puppeteer from 'puppeteer';
import os from 'os';
import { createWorker  }  from 'tesseract.js';



(async () => {
    const browser = await puppeteer.launch(); 
    const page = await browser.newPage();
    await page.setViewport({
        width: 700,
        height: 100
    })
     
    await page.goto('https://fnxln.github.io/ssonegometroapi/');
    await page.screenshot({path: 'temp.jpg'});
  
    await browser.close();
  
    
  })();

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize('./temp.jpg');
  console.log(text);
  await worker.terminate();
})();