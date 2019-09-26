/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

//
// Basic node example that prints document metadata and text content.
// Requires single file built version of PDF.js -- please run
// `gulp singlefile` before running the example.
//

// Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
var pdfjsLib = require('pdfjs-dist');
var fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

var filename = 'credicorp';

// Loading file from file system into typed array
var pdfPath = process.argv[2] || '../custom test/'+filename+'.pdf';

// Will be using promises to load document, pages and misc data instead of
// callback.
var loadingTask = pdfjsLib.getDocument({url: pdfPath, disableFontFace: false});
loadingTask.promise.then(function(doc) {
  var numPages = doc.numPages;
  console.log('# Document Loaded');
  console.log('Number of Pages: ' + numPages);
  console.log();

  var lastPromise; // will be used to chain promises
  lastPromise = doc.getMetadata().then(function (data) {
    console.log('# Metadata Is Loaded');
    console.log('## Info');
    console.log(JSON.stringify(data.info, null, 2));
    console.log();
    if (data.metadata) {
      console.log('## Metadata');
      console.log(JSON.stringify(data.metadata.getAll(), null, 2));
      console.log();
    }
  });

  var loadPage = function (pageNum) {
    return doc.getPage(pageNum).then(function (page) {
        if(pageNum == 2){
            console.log('# Page ' + pageNum);
            var viewport = page.getViewport({ scale: 2.5, });
            console.log('Size: ' + viewport.width + 'x' + viewport.height);
            console.log();
            //console.log("#Page object", page);
            //console.log();
            getOperatorList(page);
            /*page.getOperatorList().then((v)=>{
                console.log(v);
            });*/
            
            return page.getTextContent().then(function (content) {
                // Content contains lots of information about the text layout and
                // styles, but we need only strings at the moment
                var strings = content.items.map(function (item) {
                  return item.str;
                });

                var minstrings = strings.map((value)=>{
                  return value.toLowerCase();
                }).filter((element)=>{
                  return element.indexOf('portafolio')!=-1 || element.indexOf('composición')!=-1 || element.indexOf('calificación')!=-1
                });

                console.log("update minstrings", minstrings.length);
                console.log("contains keywords",minstrings.length>0);
                console.log(minstrings);

                if(minstrings.length>0){
                  var viewport = page.getViewport({scale: 5});
                  var canvas = createCanvas(viewport.width, viewport.height);
                  var ctx = canvas.getContext('2d');
                  ctx.font = "normal 12px Verdana";
                  var canvasFactory = new NodeCanvasFactory();
                  var renderContext = { canvasContext: ctx, viewport: viewport, canvasFactory };
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  var task = page.render(renderContext);
                  task.promise.then(function(){
                    let floffy = canvas.toDataURL('image/jpeg');
                    var data = floffy.replace(/^data:image\/\w+;base64,/, "");
                    var buf = Buffer.from(data, 'base64');
                    fs.writeFile(filename+'.png', buf,(err)=>{
                        if(err) console.log("error creating file");
                        else console.log("success creating file");
                    });
                  });
                }

                /*console.log('## Text Content');
                console.log(strings.join(' '));
                console.log();

                var items = content.items;
                console.log('## Items Content');
                items.forEach((element)=>{
                    console.log(element);
                });
                console.log();*/
                
            }).then(function () {
                console.log();
            });
        }
    });
  };
  // Loading of the first page will wait on metadata and subsequent loadings
  // will wait on the previous pages.
  for (var i = 1; i <= numPages; i++) {
    lastPromise = lastPromise.then(loadPage.bind(null, i));
  }
  return lastPromise;
}).then(function () {
  console.log('# End of Document');
}, function (err) {
  console.error('Error: ' + err);
});

async function getOperatorList(page){
    //let objs = [];
    let ops = await page.getOperatorList();
    //for (var i=0; i < ops.fnArray.length; i++) {
    /*let keys = Object.keys(pdfjsLib.OPS);
    console.log(keys, keys.length);*/
    for (var i=0; i < ops.fnArray.length; i++) {
        /*for(var o = 0; o < keys.length; o++){
            if (ops.fnArray[i] == pdfjsLib.OPS[keys[o]]){
                console.log([keys[o], ops.fnArray[i], pdfjsLib.OPS[keys[o]], ops.fnArray[i] == pdfjsLib.OPS[keys[o]]]);
            }
        }*/
        
        //console.log([ops.fnArray[i], pdfjsLib.OPS.paintJpegXObject, typeof ops.fnArray[i], typeof pdfjsLib.OPS.paintJpegXObject], ops.fnArray[i] == pdfjsLib.OPS.paintJpegXObject);
        
        if (ops.fnArray[i] == pdfjsLib.OPS.paintImageXObject) {
            //objs.push(ops.argsArray[i][0])
            console.log(ops.argsArray[i][0]);
        }
    }
    //console.log(objs);
}

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    // assert(width > 0 && height > 0, 'Invalid canvas size');
    var canvas = createCanvas(width, height);
    var context = canvas.getContext("2d");
    return {
      canvas: canvas,
      context: context
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    // assert(canvasAndContext.canvas, 'Canvas is not specified');
    // assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    // assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
};