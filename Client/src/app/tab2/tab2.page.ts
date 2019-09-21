import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { EventManagerService } from '../services/eventManager/event-manager.service';
import { ApiService } from '../services/api/api.service';

interface link  {
  uri: string,
  isDownloadable: boolean
};

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {


  options = {
    depth: 0,
  }

  toggleCtrl = {};
  searchCtrl = {};

  scraped: any = [];
  scrapedDisplay: any = [];

  
  constructor(private storage: Storage, public alertController: AlertController, private evManager: EventManagerService, private apiService: ApiService) {
    this.evManager.eventManager.on('SourcesLoaded',()=>{
      this.storage.get('SOURCES').then((value)=>{
        if (value) {
          this.scraped = value;
          this.scrapedDisplay = this.scraped;
        }
      });
    }); 
  }

  ngOnInit(){
    this.defaultFeatures();
  }

  defaultFeatures(){
    this.storage.get('SOURCES').then((value)=>{
      if (value) {
        this.scraped = value;
        this.scrapedDisplay = JSON.parse(JSON.stringify(this.scraped));
      }
    });
  }

  /*
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    const blob = new Blob(next, {type: "octet/stream"}),
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  */

  async saveData(){
    let finalURLArray = [];
    for (let index = 0; index < this.scraped.length; index++) {
      for (let jndex = 0; jndex < this.scraped[index].links.length; jndex++) {
        if(this.scraped[index].links[jndex].isDownloadable){
          console.log("asking for", this.scraped[index].links[jndex].uri);
          let element = await this.downloadLinkFromUrl(this.scraped[index].links[jndex].uri);
          //this.download_file(this.scraped[index].links[jndex].uri, this.scraped[index].links[jndex].uri.substring(this.scraped[index].links[jndex].uri.lastIndexOf('/')-1)+'.pdf')
          finalURLArray.push(this.scraped[index].links[jndex].uri);
        }
      }
    }
    console.log(finalURLArray);
    /*this.scraped.forEach(element => {
      element.links.forEach(link => {
        if(link.isDownloadable) {
          
          finalURLArray.push();
        }
      });
    });*/
    /*Promise.all(finalURLArray).then(()=>{
      console.log(finalURLArray);
    }).catch(error=>{
      console.log(error);
    });*/
  }

  downloadLinkFromUrl(uri){
    return new Promise((resolve, reject)=>{
      console.log("downloading",uri);
      let request = this.apiService.request(uri.replace(/[?]/g, '$'));
      request.subscribe(
        response=>{
          console.log("response found",response);
          //this.domDownload(uri, response);
          resolve(uri);
        },
        error=>{
          console.log("error found", error);
          reject(error);
        }
      );
    });
  }

  download_file(fileURL, fileName) {
    
    var reqObj = new XMLHttpRequest();
    reqObj.open('GET',fileURL,true);     // 'getpdf' is the URI to recongize your request at the server
    reqObj.send();

    reqObj.onreadystatechange = function() {
        var resObj = this;
        if(resObj.readyState == resObj.DONE) {
            if (resObj.status != 200) {
                console.log("pdf can't be downloaded");
            } else if (resObj.status == 200){
                var resTxt = reqObj.responseText;
                window.location.assign(resTxt);    // Opens the pdf download prompt
            }
        }
    }
    
    //var save = document.createElement('a');
    //save.style.display = 'none';
    //let save = (<HTMLImageElement>document.querySelector('#my_iframe'));
    //save.src = 'http://'+fileURL;
    /*(<HTMLImageElement>document.querySelector('#my_iframe')).target = fileURL;
    save.href = fileURL;
    save.target = '_blank';
    var filename = fileURL.substring(fileURL.lastIndexOf('/')+1);
    save.download = fileName || filename;*/
    //save.click();
    // for non-IE
    /*if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        var filename = fileURL.substring(fileURL.lastIndexOf('/')+1);
        save.download = fileName || filename;
	       if ( navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
				document.location = save.href; 
			}else{
		        var evt = new MouseEvent('click', {
		            'view': window,
		            'bubbles': true,
		            'cancelable': false
		        });
		        save.dispatchEvent(evt);
		        (window.URL || window.webkitURL).revokeObjectURL(save.href);
			}	
    }

    // for IE < 11
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }*/
}

  domDownload(uri, blobber){
      var clickable;
      clickable = document.createElement('a');
      document.body.appendChild(clickable);
      clickable.style.display = 'none';
      const blob = new Blob(blobber, {type: "octet/stream"});
      const url = window.URL.createObjectURL(blob);
      clickable.href = uri;
      clickable.download = uri+'.pdf';
      clickable.click();
      //clickable.parentNode.removeChild(clickable);
      window.URL.revokeObjectURL(url);
  }

  setFilteredItems(name) {
    if(this.searchCtrl[name]!="" && this.searchCtrl[name]!=undefined && this.searchCtrl[name]!=null)
      this.scrapedDisplay[this.scrapedDisplay.findIndex(k=> k.url == name)].links = this.filterItems(this.searchCtrl[name], name);
    else
      this.scrapedDisplay[this.scrapedDisplay.findIndex(k=> k.url == name)].links = this.scraped[this.scraped.findIndex(k=> k.url == name)].links;
  }

  filterItems(searchTerm, name){
    let pivot = JSON.parse(JSON.stringify(this.scraped));
    return pivot[pivot.findIndex(k=> k.url == name)].links.filter((element) => {
      return element.uri.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  async alertConfig() {
    const alert = await this.alertController.create({
      header: 'Configuración',
      subHeader: 'Estas son las opciones de configuración definidas:',
      message: this.getFeatures(),
      buttons: ['OK']
    });

    await alert.present();
  }

  getFeatures(){
    return JSON.stringify(this.options, null, 4);
  }

  getScraped(){
    return JSON.stringify(this.scraped);
  }

  unCheckAllForScraped(name){
    for (let index = 0; index < this.scraped.length; index++) {
      if(this.scraped[index].url == name)
          this.toggleSelector(this.scraped[index].links, false);
    }
    this.scrapedDisplay = JSON.parse(JSON.stringify(this.scraped));
  }

  toggleSelector(array, value){
    array.forEach(element => {
      element.isDownloadable = value;
    });
  }

  checkAllForScraped(name){
    for (let index = 0; index < this.scraped.length; index++) {
      if(this.scraped[index].url == name)
          this.toggleSelector(this.scraped[index].links, true);
    }
    this.scrapedDisplay = JSON.parse(JSON.stringify(this.scraped));
  }

  deleteItem(name){
    this.scraped = this.scraped.filter(function(item) {
      return item.url !== name
    });
    this.scrapedDisplay = JSON.parse(JSON.stringify(this.scraped));
  }
  
  RemoveAll(){
    this.scraped = [];
    this.scrapedDisplay = JSON.parse(JSON.stringify(this.scraped));
    this.evManager.eventManager.emit('DeletedSources');
  }

  orderLinks(links: Array<link>){
    return links.sort(function (a:link , b:link) {
      return (a.isDownloadable == b.isDownloadable)? 0: a.isDownloadable? -1: 1;
    });
  }

  updateScraped(link, url){
    let scrpIdx = this.scraped.findIndex(k => k.url == url);
    let linkIdx = this.scraped[scrpIdx].links.findIndex(l=> l.uri == link.uri);
    this.scraped[scrpIdx].links[linkIdx].isDownloadable = link.isDownloadable;
  }

  countSelectedLinks(wanted){
    let count = 0;
    this.scraped[this.scraped.findIndex(k => k.url == wanted)].links.forEach(link => {
        if(link.isDownloadable) count +=1;
    });
    return count;
  }

  countAllSelected(){
    let count = 0;
    this.scraped.forEach(element => {
      element.links.forEach(link => {
        if(link.isDownloadable) count +=1;
      });
    });
    return count;
  }
}
