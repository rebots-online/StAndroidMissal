const { execSync } = require('child_process');
const date = process.argv[2];
const d = date || new Date().toLocaleDateString('en-US',{timeZone:'UTC'}).replace(/\//g,'-');
const cmd = `curl -s 'https://www.divinumofficium.com/cgi-bin/missa/missa.pl?date=${d}&lang=Latin'`;
try {
  const html = execSync(cmd, {encoding:'utf8'});
  const match = html.match(/<P ALIGN="CENTER"><FONT >(.*?)<br\/>/i);
  if (match) {
    console.log(match[1]);
  } else {
    console.error('Celebration not found');
  }
} catch(e){
  console.error('curl failed', e.message);
}
