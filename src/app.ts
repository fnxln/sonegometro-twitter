import puppeteer from 'puppeteer';
import os from 'os';
import { createWorker  }  from 'tesseract.js';
import moment from 'moment';
moment.locale('pt-br');
const hora = moment().format('LL'); 
console.log(hora);

(async () => {
    const browser = await puppeteer.launch(); 
    const page = await browser.newPage();
    await page.setViewport({
        width: 700,
        height: 100
    })
    console.log('Entranndo no site')
    await page.goto('https://fnxln.github.io/ssonegometroapi/');
    
    console.log('Tirando Print')
    await page.screenshot({path: 'temp.jpg'});

    console.log('Fechando Puppeteer')
    await browser.close();
  
    
  })();

const worker = createWorker();

(async () => {

  console.log('Abrindo Tesseract')
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize('./temp.jpg');

  console.log('Dados:')
  let linhas = text.split('\n');
  linhas.splice(0,1);
  let textofinal = linhas.join('\n')
  console.log(textofinal);
  await worker.terminate();
})();