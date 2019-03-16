'use strict';

const http = require('http');
const https = require('https');

http.createServer((req, res) =>  {

  console.log('url: ' + req.url);

  const options = {
    hostname: req.headers.host,
    path: req.url,
    method: req.method,
    timeout: 10000
  };

  console.log(options);
  console.log(req.connection.encrypted);
  if (!req.connection.encrypted) {

    const proxy = http.request(options, (serverRes) => {
      //    serverRes.writeHead(res.statusCode, res.headers);
      serverRes.pipe(res, { end: true });
    });

    proxy.on('timeout', () => {
      console.log('timeout! ' +
        (options.timeout / 1000) + ' seconds expired');
      proxy.destroy();
    });

    proxy.on('error', (e) => {
      console.log('Request Error : ' + JSON.stringify(e));
    });

    console.log(proxy);

    req.pipe(proxy, { end: true });
  } else {
    const proxy = https.request(options, (serverRes) => {
      //    serverRes.writeHead(res.statusCode, res.headers);
      serverRes.pipe(res, { end: true });
    });

    proxy.on('timeout', () => {
      console.log('timeout! ' +
        (options.timeout / 1000) + ' seconds expired');
      proxy.destroy();
    });

    proxy.on('error', (e) => {
      console.log('Request Error : ' + JSON.stringify(e));
    });

    console.log(proxy);

    req.pipe(proxy, { end: true });
  }

}).listen(4242);

console.log('Server is running on port 4242');

