const http = require('http');
const url = require('url');
const fs = require('fs');

http
  .createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    console.log(pathname)
    if (pathname.indexOf('.') > -1) {
      fs.readFile('.' + pathname, (err, data) => {
        if (err) {
          console.log('文件读取失败：' + err);
          res.writeHead(404, {
            'Content-Type': 'text/html'
          });
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/x-javascript'
          });

          res.write(data.toString());
        }
        res.end();
      });
    } else if (pathname === '/') {
      fs.readFile('./index.html', (err, data) => {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(data.toString());
        res.end();
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        //'Cache-Control': 'public, max-age=1',
        'E-tag': new Buffer(JSON.stringify({ data: 'success' })).toString('base64')
      });
      res.write(JSON.stringify({ data: 'success' }));
      setTimeout(() => {
        res.end();
      }, Math.random() * 400 + 1600);
    }
  })
  .listen(3000);
