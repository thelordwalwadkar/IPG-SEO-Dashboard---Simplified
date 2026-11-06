// node assemble-simple.js <data-simple.json> <out plain html>
// Then: DASH_ID=... DASH_PW=... node encrypt.js <plain html> index.html
const fs = require('fs'), path = require('path');
// [month index (0=Jan), stage, plain-language task, date]   stages: tofu / mofu / bofu / tech
const WORK = [
  [2, 'tech', 'Full crawl of the Dutch and English site to find errors', '24 Mar'],
  [3, 'tofu', 'Boiler feed pump guide drafted', '8 Apr'],
  [3, 'tofu', 'Tracked keyword list set up in Dutch and English (147 keywords); pump-type research started', '13 Apr'],
  [3, 'tech', 'Website errors list and first findings written up', '13 Apr'],
  [3, 'mofu', 'On-page suggestions for the new boiler feed pump page', '13 Apr'],
  [3, 'tech', 'Extra crawls of the Ebara and SAER brand sections', '23 Apr'],
  [3, 'tofu', 'Competitor check: crawl of the Xylem website', '26 Apr'],
  [4, 'tech', 'robots.txt reviewed (which pages Google may read)', '7 & 27 May'],
  [4, 'tech', 'Crawl of the German site started', '12 May'],
  [4, 'mofu', 'On-page recommendations for the cooling-water pump page', '28 May'],
  [5, 'tech', 'Structured data (schema) examples prepared', '3 Jun'],
  [5, 'tech', 'Sitemap, image sitemap and robots.txt refreshed', '3–8 Jun'],
  [5, 'mofu', 'Flygt new-products catalogue translated from French', '8 Jun'],
  [5, 'tofu', 'Keyword research for the new Flygt pumps', '10 Jun'],
  [6, 'tofu', 'German keywords grouped by topic', '1 Jul'],
  [6, 'mofu', 'Product list checked: pages already live vs new products', '13 Jul'],
  [6, 'tech', 'Page speed audit', '15 Jul'],
  [6, 'tofu', 'Boiler feed pump and German keyword sets researched', '16 Jul'],
  [6, 'tech', 'Product technical details turned into structured data', '21–22 Jul'],
  [6, 'mofu', 'Lowara analysis (VEG and Xylem)', '24 Jul'],
  [7, 'tech', 'Broken and wrong URLs checked', '20 Aug'],
  [7, 'tofu', 'Master keyword list updated (about 4,340 keywords sorted by topic)', '26 Aug'],
  [8, 'tech', 'robots.txt reviewed again', '22 Sep'],
  [8, 'tech', 'Custom crawl across all pages', '24–29 Sep'],
  [9, 'mofu', 'Xylem material collected for the Flygt 2000 series and DAF rental', '5 Oct'],
  [9, 'bofu', 'Flygt product series and product pages put live (marked completed in the plan)', 'by mid-Oct'],
  [9, 'mofu', 'Internal link opportunities listed for Lowara, Ebara, SAER, Flygt and more', '21 Oct'],
  [9, 'mofu', 'Master list of all IPG page URLs', '21 Oct'],
  [9, 'tofu', 'German market: competition review and keyword research for NRW', '23–28 Oct']
].map(([m, s, t, d]) => ({ m, s, t, d }));
const here = __dirname;
let t = fs.readFileSync(path.join(here, 'template-simple.html'), 'utf8');
t = t.replace('__DATA__', () => fs.readFileSync(process.argv[2], 'utf8')).replace('__WORK__', () => JSON.stringify(WORK));
fs.writeFileSync(process.argv[3], t); console.log('ok', t.length);
