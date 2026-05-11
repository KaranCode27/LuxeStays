import https from 'https';

const url = 'https://picsum.photos/seed/taj/1000/600';

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Location:', res.headers.location);
}).on('error', (e) => {
  console.error(e);
});
