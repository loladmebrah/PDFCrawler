import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { EventManagerService } from '../services/eventManager/event-manager.service';
import { ApiService } from '../services/api/api.service';
import { saveAs } from 'file-saver';
import { reject } from 'q';

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

  
  constructor(private storage: Storage, 
    public alertController: AlertController, 
    private evManager: EventManagerService,
    private apiService: ApiService,
    private loadingController: LoadingController) {
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
    let promiseArray = [];

    const loading = await this.loadingController.create(this.generateLoadingOptions());
    await loading.present();
    
    this.scrapePDF(finalURLArray, async (data)=>{
      await loading.dismiss();
      this.alertDownload();
    });

  }

  async scrapePDF(finalURLArray, callback){
    let err, solution;
    for (let index = 0; index < this.scraped.length; index++) {
      for (let jndex = 0; jndex < this.scraped[index].links.length; jndex++) {
        if(this.scraped[index].links[jndex].isDownloadable){
          [err, solution] = await this.to(this.downloadLinkFromUrl(this.scraped[index].links[jndex].uri));
          if(err) {
            finalURLArray.push({status:"failure", data: err});
          }else if (solution){
            finalURLArray.push({status:"success", data: solution});
          }
        }           
      }
    }
    callback(finalURLArray);
  }

  generateLoadingOptions(){
    return {
      spinner: null,
      message: 'Descargando...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    }
  }

  downloadLinkFromUrl(uri){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
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
      },200);
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

  async alertDownload() {
    const alert = await this.alertController.create({
      header: 'Listo!',
      subHeader: 'Se han descargado todos los pdfs seleccionados',
      message: 'Por favor revise su carpeta de descargas',
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

  orderLinks(links: Array<link>, value){
    return links.filter((a: link)=>{
      return a.isDownloadable == value;
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

  getSmollName(value){
    let i = 3;
    while(value[i]==undefined && i>-1){ i -=1;  }
    return value[i];
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Alto!',
      message: '¿Está seguro de haber configurado correctamente su carpeta de descargas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'De acuerdo',
          handler: () => {
            this.saveData();
          }
        }
      ]
    });

    await alert.present();
  }

  getSmallName(uri){
    return (this.nth_occurrence(uri,'/',3) !=-1)? uri.substring(this.nth_occurrence(uri,'/',3), uri.length): uri.substring(this.nth_occurrence(uri,'/',1), uri.length);
  }

  nth_occurrence (string, char, nth) {
      var first_index = string.indexOf(char);
      var length_up_to_first_index = first_index + 1;

      if (nth == 1) {
          return first_index;
      } else {
          var string_after_first_occurrence = string.slice(length_up_to_first_index);
          var next_occurrence = this.nth_occurrence(string_after_first_occurrence, char, nth - 1);
          if (next_occurrence === -1) {
              return -1;
          } else {
              return length_up_to_first_index + next_occurrence;  
          }
      }
  }

  to(promise) {
    return promise.then(data => {
       return [null, data];
    }).catch(err => [err]);
  }

}
