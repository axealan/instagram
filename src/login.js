const express = require('express');
const puppeteer = require('puppeteer');

const TARGET = 'https://www.instagram.com/accounts/login';
const FOLLOW_BUTTON_SELECTOR = 'button._acan._acap._acas._aj1-';
const USER_PROFILE_URL_BASE = 'https://www.instagram.com/';

const app = express();
const port = 3000;

let result = '';

async function realizarLogin(req) {
  const email = req.query.email || '@donademim.ofc1';
  const password = req.query.password || 'Chuteboxe1$';
  const userProfiles = req.query.user || 'neymarjr,cr7,messi';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(TARGET);
  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector('input[name="username"]');

  await page.type('input[name="username"]', email);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  const isLoggedIn = await page.evaluate(() => {
    const errorElement = document.querySelector('.eiCW-');
    return !errorElement; // Se não houver erro, o login foi bem-sucedido
  });

  if (isLoggedIn) {
    result = 'Login bem-sucedido';

    for (const userProfile of userProfiles.split(',')) {
      await page.goto(`${USER_PROFILE_URL_BASE}${userProfile}`);
      await page.waitForSelector(FOLLOW_BUTTON_SELECTOR);
      await page.click(FOLLOW_BUTTON_SELECTOR);

      // Aguardar 30 segundos antes de prosseguir para o próximo usuário
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  } else {
    result = 'Erro ao fazer login';
  }

  await browser.close();
}

app.get('/', async (req, res) => {
  await realizarLogin(req);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
