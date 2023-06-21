const express = require('express');
const puppeteer = require('puppeteer');

const TARGET = 'https://www.instagram.com/accounts/login';
const FOLLOW_BUTTON_SELECTOR = 'button._acan._acap._acas._aj1-';
const USER_PROFILE_URL = 'https://www.instagram.com/manobrown';

const app = express();
const port = 3000;

let result = '';

async function realizarLogin(req) {
  const email = req.query.email || '@donademim.ofc1';
  const password = req.query.password || 'Chuteboxe1$';

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

    await page.goto(USER_PROFILE_URL);
    await page.waitForSelector(FOLLOW_BUTTON_SELECTOR);
    await page.click(FOLLOW_BUTTON_SELECTOR);
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
