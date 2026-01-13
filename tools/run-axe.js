const puppeteer = require('puppeteer');
const AxePuppeteer = require('@axe-core/puppeteer').default;

(async ()=>{
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const urls = ['http://127.0.0.1:8080/index.html','http://127.0.0.1:8080/template-producto.html'];
  for(const url of urls){
    console.log('Auditing', url);
    await page.goto(url, {waitUntil:'networkidle2'});
    const results = await new AxePuppeteer(page).analyze();
    console.log(JSON.stringify({url, violations: results.violations}, null, 2));
    const contrast = results.violations.filter(v=> v.id === 'color-contrast' || v.id === 'image-alt');
    if(contrast.length>0){
      console.warn('Violaciones de contraste/alt encontradas:', contrast.length);
    }
  }
  await browser.close();
  process.exit(0);
})();
