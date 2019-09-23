import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { EventManagerService } from '../services/eventManager/event-manager.service';
import { ApiService } from '../services/api/api.service';
import { saveAs } from 'file-saver';

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

  async saveData(){
    let finalURLArray = [];
    for (let index = 0; index < this.scraped.length; index++) {
      for (let jndex = 0; jndex < this.scraped[index].links.length; jndex++) {
        if(this.scraped[index].links[jndex].isDownloadable){
          await this.downloadLinkFromUrl(this.scraped[index].links[jndex].uri)
          .then((resp)=>{
            finalURLArray.push(resp);
          }).catch((rejec)=>{
            finalURLArray.push(rejec);
          });          
        }
      }
    }
    console.log(finalURLArray);
  }

  downloadLinkFromUrl(uri){
    return new Promise((resolve, reject)=>{
      let request = this.apiService.request(uri.replace(/[?]/g, '$'));
      request.subscribe(
        response=>{
          saveAs(response, this.createNameForFile(uri) );
          resolve(uri);
        },
        error=>{
          console.log("error found", error);
          reject(error);
        }
      );
    });
  }

  createNameForFile(uri){
    let reference = uri.substring(0, uri.indexOf('.co'));
    reference = reference.substring(reference.indexOf('.')+1);
    let name;
    if(uri.indexOf('.pdf')!=-1){
      name = uri.substring(uri.indexOf('/'),uri.lastIndexOf('.pdf')+4);
      name = name.substring(name.lastIndexOf('/')+1);
    }else{
      name = uri.substring(uri.lastIndexOf('/')+1);
      name = (name.indexOf('?')!=-1)? name.substring(0, name.indexOf('?')+1)+'.pdf':name+'.pdf';
    }
    return reference+"_"+name;
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
