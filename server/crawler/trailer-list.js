const puppeteer = require('puppeteer');
const url = `https://movie.douban.com/tag/#/?sort=U&range=9,10&tags=`;

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
});
(async () => {
  console.log('Start visit the target page');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  });
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle2'});
  await sleep(3000);
  await page.waitForSelector('.more');

  //抓取2页数据
  for (let i = 0; i < 1; i++) {
    await sleep(3000);
    await page.click('.more');
  }
  const result = await page.evaluate(() => {
    var $ = window.$;
    var items = $('.list-wp a');
    var links = [];
    if(items.length >= 1) {
      items.each((index,item) => {
        let it = $(item);
        let doubanId = it.find('div').data('id');
        let title = it.find('.title').text();
        let rate = Number(it.find('.rate').text());
        let poster = it.find('img').attr('src').replace('s_ratio','l_ratio');
        links.push({
          doubanId,
          title,
          rate,
          poster,
        })
      })
    }
    return links;
  });

  await browser.close();
  //process 为全局的
  process.send({result});
  process.exit(0);

})();
