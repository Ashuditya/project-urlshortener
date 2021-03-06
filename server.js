require('dotenv').config();
const express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect("mongodb+srv://ashuditya:ashu12345@cluster0.rcilr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");


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

app.post("/api/shorturl", bodyParser.urlencoded({extended: false}), (req,res) =>{
  var inputUrl = req.body.url;
  console.log(inputUrl);
  // let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
  
  // if(!inputUrl.match(urlRegex)){
  //   res.json({error: 'invalid url'})
  //   return
  // }
  
  if(!inputUrl.startsWith("http")){
    res.json({
      error: 'invalid url'
    });
    return;
  }

  let responseObject = {}
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
            res.json({
              original_url: req.body.url,
              short_url: data.short
            });
          }
        });
    }

    
  });
});

app.get("/api/shorturl/:num", (req,res) => {
  var {num} = req.params;
  Url.findOne({short: num}, (err, data) => {
    console.log(data);
    console.log("-------------------------------------------");
    if(!err && data!=undefined){
      res.redirect(data.url);
    }else{
      res.json({error: 'invalid url'});
    }
  });
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
}); //change

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
