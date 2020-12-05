import puppeteer from 'puppeteer';
import os from 'os';
import fs from 'fs';
import { createWorker  }  from 'tesseract.js';
import moment from 'moment';
import dotenv from 'dotenv';
import twit from 'twit';
import Intl from 'intl';
import cron, { CronJob } from 'cron';
import { isElementAccessExpression } from 'typescript';
//date stuff
moment.locale('pt-br');
const hora = moment().format('LL'); 
console.log(hora);
//twitter api
var T = new twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});

var job = new CronJob('* * * * * *', function() {

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
});

 /* $2,500.00 */
 let dindinstring = formatter.format(dindin);
  console.log(formatter.format(dindin));
      T.post('statuses/update', { status: ('Hoje, \n' + hora + '\nForam salvos: \n' + dindinstring + ' \nDa mao do estado que podem ser usados na circulação da economia') }, function(err, data, response) {
  console.log(data);
  
      }
  
      );
  }
  


  await worker.terminate();
})();
}, null, true, 'America/Los_Angeles');
job.start();