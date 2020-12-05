import puppeteer from 'puppeteer';
import os from 'os';
import fs from 'fs';
import { createWorker  }  from 'tesseract.js';
import moment from 'moment';
import dotenv from 'dotenv';
import twit from 'twit';
import Intl from 'intl';
import { isElementAccessExpression } from 'typescript';
//date stuff
moment.locale('pt-br');
const hora = moment().format('LL'); 
console.log(hora);
//twitter api
var T = new twit({
  consumer_key:         process.env.consumer_key ?? '',
  consumer_secret:      process.env.consumer_secret ?? '',
  access_token:         process.env.access_token ?? '',
  access_token_secret:  process.env.access_token_secret ?? '',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});




// puppeteer stuff
(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']}); 
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




  // tesseract stuff
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

  
  let linhas = text.split('\n');
  linhas.splice(0,1);
  let textofinal = linhas.join('\n')
  if (textofinal.length <= 12){
    console.log('A porra do tesseract bugou o tamanho da string foi de: ' + textofinal.length + ' Caracteres, aguarde a proxima run')
  }
  if (textofinal.length >= 12){
    console.log('Dados:');
    console.log(textofinal);
    let dindin = parseInt(textofinal);
    var formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

 /* $2,500.00 */
console.log(formatter.format(dindin));
  //     T.post('statuses/update', { status: dindinstring }, function(err, data, response) {
  // console.log(data);
  
  //     }
  
      // );
  }
  


  await worker.terminate();
})();
