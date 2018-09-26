const puppeteer = require('puppeteer');
const base = `https://movie.douban.com/subject/`;
const doubanId = 26336252;
const videoBase = `https://movie.douban.com/trailer/235216`;

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
  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2'
  });
  await sleep(1000);

  const result = await page.evaluate(() => {
    var $ = window.$;
    var it = $('.related-pic-video');
    if(it && it.length > 0) {
      var link = it.attr('href');
      var img = it.attr('style');
      var cover = img.substr((img.indexOf('https'))).replace(')','');
      return {
        link,cover
      }
    }
    return {}
  });
  //当爬取到有视频地址
  let video;
  if(result.link) {
    await page.goto(result.link,{
      waitUntil: 'networkidle2'
    });
    await sleep(2000);
    video = await page.evaluate(() => {
      var $ = window.$;
      var it = $('source');
      if(it && it.length > 0) {
        return it.attr('src');
      }
      return '';
    })
  }
  const data = {
    video,doubanId,cover:result.cover
  }

  await browser.close();
  //process 为全局的
  process.send(data);
  process.exit(0);

})();
