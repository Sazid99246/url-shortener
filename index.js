require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const url = require('url');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// For get body from post request
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let apiMap = new Map([
  [1, 'https://you.com/search?q=hashmap+in+javascript&fromSearchBar=true'],
  [2, 'https://translate.google.com/']
])
app.post("/api/shorturl", (req, res) => {
  let lastKey =  Array.from(apiMap.keys()).pop();
  let nextKey = lastKey + 1;
  let urlReq = req.body.url;
  var isMatch = urlReq.substr(0, 8) == 'https://' || urlReq.substr(0, 7) == 'http://';
  dns.lookup(url.parse(urlReq).hostname, (err, addr, family) => {
    if (err || !isMatch){
      return res.json({ error: 'invalid url' });
    } else {
      apiMap.set(nextKey, urlReq);
      return res.json({original_url: urlReq, short_url: nextKey}); 
    }
  })
})

app.get("/api/shorturl/:url", (req, res) => {
  res.redirect(apiMap.get(Number(req.params.url)));
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});