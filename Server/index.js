const express = require('express');
const request = require('request');
const cors = require('cors');
const cheerio = require('cheerio');
const UserAgent = require ('user-agents');
const URL = require('url').URL;

request.prototype.request = function () {
  var self = this
  self.EventEmitter.defaultMaxListeners = 30;
  self.setMaxListeners(0);
}

const app = express();

var whitelist = ['http://localhost:8050','http://localhost:8100'];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS, try again'));
  }
}

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-type, Accept')
  next();
});

app.get('/scrape/*', (req, res) => {
  let url_ = req.params[0];
  if(url_!== "/") makeRequest(url_, res);
  else res.status(200).send("Write an url YOU FOOL");
});

function makeRequest(url_, res){
  //const protocol = "http://";
  //const country = 'US'
  /*request('https://www.proxy-list.download/api/v1/get?type='+protocol.replace('://','')+'&anon=elite&country='+country,(er, resp, bod)=>{
    let forDeletion = [''];
    let data = bod.split('\r\n').filter(item => !forDeletion.includes(item));
    //generateCall(url_,res, protocol+data[data.length * Math.random() | 0]);
    generateCall(url_,res, protocol+'136.244.113.211:8080');
  })*/
  generateCall(url_, res);
  
}

function generateCall(url_, res, proxy_){
  const userAgent = UserAgent.random().data.userAgent;
  const headers_ = { 'User-Agent': userAgent };

  var reqOptions;
  if (proxy_) reqOptions = {headers: headers_, url: url_, rejectUnauthorized: false, proxy:proxy_};
  else reqOptions = {headers: headers_, url: url_, rejectUnauthorized: false};
  
  request(reqOptions, (error, response, body) => {
    if (error || response.statusCode !== 200) 
      return (error!= null && error != undefined)?
      res.status(500).json({ type: 'error', message: error.message }):
      res.status(500).json({ type: 'error', message: "Response "+response.statusCode });
    return processPage(body,url_).then((result)=>{
      console.log("Files found in url:",[url_, result.length]);
      return res.status(200).json({data: result});
    }).catch((err)=>{
      console.log("Error catched", err);
      return res.status(400).json({error: err });
    });
  });
}



function processPage(body, originUrl){
  return new Promise((resolve, reject)=>{
    if(body!= undefined && body!= null){
      console.log(body);
      $ = cheerio.load(body);
      links = $('a');
      let array = [];
      $(links).each(function(i, link){
        var href = $(link).attr('href');
        let hostname = (new URL(originUrl)).hostname;
        if(sanitizeRef(href, hostname)) {
          if( href.indexOf(hostname)!==-1 || href.indexOf('http')!==-1 ) 
            array.push(href);
          else 
            array.push(hostname+href);
        }
      });
      resolve(array);
    }else
      reject("No body found");
      
  });
}

function sanitizeRef(ref, hostname){
  if(typeof ref == 'string'){
    if(checkValidExtension(ref)) 
      return true;
    else if(checkIfRunnable(ref) && hasSemiValidDomain(ref, hostname)) 
      return true;
    else 
      return false;
  }
}

function hasSemiValidDomain(ref, hostname){
  return (ref.indexOf(hostname)!== -1 || ref.indexOf('http') === -1);
}

function checkValidExtension(ref){
  return ref.indexOf('.pdf') !== -1;
}

function checkIfRunnable(r){
  return r.indexOf('?') !== -1 && !checkInvalidExtension(r);
}

function checkInvalidExtension(ref){
  return ref.match( /(asp|php|jsp)/ );
}

const PORT = process.env.PORT || 4201;
app.listen(PORT, () => console.log(`listening on ${PORT}`));