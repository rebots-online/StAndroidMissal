import https from 'https';

function fetchMass(date: string) {
  const url = `https://www.divinumofficium.com/cgi-bin/missa/missa.pl?date=${date}&lang=Latin`;
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<P ALIGN="CENTER"><FONT >(.*?)<br\/>/i);
      if (match) {
        console.log(match[1]);
      } else {
        console.error('Celebration not found');
      }
    });
  }).on('error', err => {
    console.error('Error fetching Mass:', err);
  });
}

const [,, date] = process.argv;
if (!date) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  fetchMass(`${month}-${day}-${year}`);
} else {
  fetchMass(date);
}
