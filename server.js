require('dotenv').config();
const express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

var num = null;
var add = null;

// Basic Configuration
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl", (req,res) =>{
  console.log(req.body);
  var s = '';
  if (req.body.url.startsWith("http://"))  
    res.json({"url": req.body.url, "short_url": 1});
  else
    res.json({"error": "invalid url"});
});
app.get("/api/shorturl/:surl", (req,res) => {
  var {surl} = req.params;
  if (surl===num){
    
  }else{

  }
  
});
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
