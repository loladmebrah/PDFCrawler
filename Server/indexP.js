const puppeteer =  require('puppeteer');
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const UserAgent = require ('user-agents');
const cors = require('cors');
const URL = require('url').URL;

request.prototype.request = function () {
  var self = this
  self.EventEmitter.defaultMaxListeners = 30;
  self.setMaxListeners(0);
}

const app = express();
var browser;

var whitelist = ['http://localhost:8050','http://localhost:8100','http://localhost:4200', 'https://SkyBlueServer.sat0-k4.repl.co:4200', null,undefined];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS, try again '+JSON.stringify([origin, whitelist.indexOf(origin)])));
  }
}

app.use(cors(corsOptions));

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


app.get('/request/*', (req, res) => {
  let url_ = req.params[0];
  remoteCalling(url_, res);
});


async function remoteCalling(url_, clientResponse){
  let url = url_.replace(/\$/g, '?')
  let filename = url.substring(url.lastIndexOf('/')+1).replace(/\W/g, '')+'.pdf';
  await new Promise((resolve, reject)=>{
    console.log("scraping..."+url);
    url = (url.match(/(http:|https:)/g) != null)? url: 'http://'+url;
    request(createHeaders(url)).on('response', remoteRes => {
      remoteRes.headers["Access-Control-Allow-Origin"] = "*";
      remoteRes.headers["Access-Control-Allow-Headers"] = "X-Requested-With";
      remoteRes.headers["Content-Type"] = "application/pdf";
      remoteRes.headers["Content-Disposition"] = "attachment; filename="+filename+'"';
    }).pipe(clientResponse).on('finish', (something)=>{
      resolve(something);
    }).on('error', err=>{
      if(err) reject(JSON.stringify(err));
    });
  }).then((data)=>{
      console.log("Succesfully scraped pdf ... "+url);
  }).catch(error=>{
      console.log(`we failed: ${error}`);
      clientResponse.status(500).json({ type: 'error', message: JSON.stringify(error) });
  });
}

function createHeaders(url){
 return {uri: url,
    "rejectUnauthorized": false,  
    headers:{
        'Accept': 'text/html, application/pdf, application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    }
  };
}


function makeRequest(url_, res){
  generateCall(url_, res);
}

async function generateCall(url_, res, proxy_){
  const userAgent = UserAgent.random().data.userAgent;
  const headers_ = { 'User-Agent': userAgent };

  var reqOptions;
  if (proxy_) reqOptions = {headers: headers_, url: url_, rejectUnauthorized: false, proxy:proxy_};
  else reqOptions = {headers: headers_, url: url_, rejectUnauthorized: false};
  let r = await requestData(userAgent, url_, res);
  return r;
}


function processPage(body, originUrl){
  return new Promise((resolve, reject)=>{
    if(body!= undefined && body!= null){
      $ = cheerio.load(body);
      links = $('a');
      let array = [];
      $(links).each(function(i, link){
        var href = $(link).attr('href');
        let hostname = (new URL(originUrl)).hostname;
        if(sanitizeRef(href, hostname)) {
          if( href.indexOf(hostname)!==-1 || href.indexOf('http')!==-1 )  array.push(href);
          else {
            let finalurl = hostname+'/'+href;
            finalurl = finalurl.replace(/\/\//g,'/');
            array.push(finalurl);
          }
        }
      });
      resolve(array);
    }else
      reject("No body found");
      
  });
}

function sanitizeRef(ref, hostname){
  if(typeof ref == 'string'){
    if(checkMainWords(ref))
        return true;
    else if(checkValidExtension(ref)) 
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
  return r.match( /\?/g ) !== -1 && !checkInvalidStrings(r);
}

function checkInvalidStrings(ref){
  return ref.match( /(mailto|@)/g );
}

function checkInvalidExtension(ref){
  return ref.match( /(asp|php|jsp)/g );
}

function checkMainWords(ref){
    return ref.match(/(ficha|tecnica|técnica|download)/g);
}

async function run(){
    browser = await puppeteer.launch();
    const PORT = process.env.PORT || 4200;
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
    
}

function requestData(userAgent, url_, res){
  generalRequest(userAgent, url_, res, (description, error)=>{
    console.log("Enforcing pupe request",[description, error]);
    puppeteerRequest(userAgent, url_, res);
  });
    
}

async function puppeteerRequest(userAgent, url_, res){
  let page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.goto(url_, {waitUntil: 'networkidle2', timeout: 0});
  let body = await page.content();
  return processPage(body,url_).then((result)=>{
        console.log("Files found in url:",[url_, result.length]);
        closePage(page);
        return res.status(200).json({data: result});
  }).catch((err)=>{
        console.log("Error catched", err);
        closePage(page);
        return res.status(400).json({error: err });
  });
}

function generalRequest(userAgent, url_, res, callback){
  const headers_ = { 'User-Agent': userAgent };
  let reqOptions= {headers: headers_, url: url_, rejectUnauthorized: false};
  
  request(reqOptions, (error, response, body) => {
    if (error || response.statusCode !== 200) 
      (error!= null && error != undefined)? callback("general error", [error, response.statusCode]): callback("no error error", [null, response.statusCode]);
    return processPage(body,url_).then((result)=>{
      console.log("Files found in url:",[url_, result.length]);
      return res.status(200).json({data: result});
    }).catch((err)=>{
      console.log("Error catched", err);
      return res.status(400).json({error: err });
    });
  });
}

async function closePage(page){
  await page.goto('about:blank');
  await page.close();
}

run();