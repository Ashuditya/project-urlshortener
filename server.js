require('dotenv').config();
const express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect(process.env.MONGO_URI);


const urlSchema = mongoose.Schema({
  url : {type: String, required: true},
  short : Number
});

let Url = mongoose.model("Url", urlSchema);


// Basic Configuration
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let responseObject = {}
app.post("/api/shorturl", bodyParser.urlencoded({extended: false}), (req,res) =>{
  if (req.body.url.startsWith("http://")){
    let s_url = 1;
    responseObject['original_url'] = req.body.url;
    Url.findOne({})
    .sort({short: -1})
    .exec((err, data) =>{
      if(!err && data!=undefined)
        s_url = data.short + 1;
      if(!err){
        Url.findOneAndUpdate(
          {url: req.body.url}, //search
          {url: req.body.url, short: s_url}, // update 
          {new: true, upsert: true},
          (err, data) => {
            if(!err){
              responseObject['short_url'] = data.short;
              res.json(responseObject);
            }
          });
      }else
        res.json({"error": 'invalid url'});

      
    });
}
  else
    res.json({"error": "invalid url"});
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
