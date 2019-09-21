import { Component, OnInit, OnChanges } from '@angular/core';
import { FileItem } from './model/FileItem';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, generate } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api/api.service';
import { EventManagerService } from '../services/eventManager/event-manager.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  isLoading = false;
  progress = {value:0, index:1, length:0, status:""};
  files_: FileItem [] = [];
  files = [];
  exampleFile = {
    file: {
      path: './test/path',
      fileName: 'Filetest.pdf',
      data: null
    }, 
    name:'Filetest', 
    isDownloadable: true,
    imgSrc:'https://images-na.ssl-images-amazon.com/images/I/417Y8qz6oXL.png',
    imgHeight:300
  };

  sources = {
    name: 'SOURCES',
    data: []
  };
  
  depth: number;
  constructor(private storage: Storage, 
              private httpClient: HttpClient, 
              private alertController: AlertController, 
              private apiService: ApiService,
              private loadingCtrl: LoadingController,
              private evManager: EventManagerService) {
  }

  ionViewWillEnter(){
    this.loadData();
  }

  ngOnInit(){
  }

  loadData(){
    this.storage.get('depth').then((depth)=>{
      this.depth = depth;
      this.storage.get('urlData').then((urlData)=>{
        if(urlData!==undefined && urlData !== null && urlData.length>0) this.createList(urlData[0]);
      });
    });
  }

  createList(data){
    this.files = [];
    for (let index = 0; index < data.length; index++)
      this.files.push(this.constructFileObj(data[index]));      
  }

  constructFileObj(objectF){
    return {
      category: objectF['Categoría']? objectF['Categoría']: objectF['Categoria']? objectF['Categoria']: objectF['categoría']? objectF['categoría']: objectF['categoria']? objectF['categoria']:"" ,
      name: objectF['Fondo'] + " " + objectF['Entidad'],
      url: objectF['Url']? objectF['Url']: objectF['url']? objectF['url']:"",
      keywords: objectF['keywords']? objectF['keywords']: objectF['Keywords'],
      isDownloadable: true,
      imgSrc:'https://images-na.ssl-images-amazon.com/images/I/417Y8qz6oXL.png',
      imgHeight:300
    };
  }

  SelectAll(){
    this.files.forEach((element)=>{
      element.isDownloadable = true;
    });
  }

  DeSelectAll(){
    this.files.forEach((element)=>{
      element.isDownloadable = false;
    });
  }

  EraseAll(){
    this.storage.remove('urlData').then(()=>{
      this.files = [];
    });
  }

  async generateSources(){
    this.isLoading = true;
    this.progress.length = this.files.filter(el=>el.isDownloadable == true).length;
    for (let index = 0; index <this.files.length; index++) {
      if(this.files[index].isDownloadable){
        await this.getLinksFromUrl(this.files[index].url).then((res)=>{ 
          console.log((index + 1)+" "+this.files[index].url+" succesfully passed arrays", [this.files[index],res]);
          this.sources.data.push({url: this.files[index].url, links: this.convertResponseToValidableObject(res, this.files[index].keywords)});
        }).catch((err)=>{
          console.log((index + 1)+" "+this.files[index].url+" Catched on Promise", err);
        });
      }
    }
    this.isLoading = false;
    this.progress = {value:0, index:1, length:0, status:""};
    this.evManager.eventManager.emit('LoadSources', this.sources);
  }

  convertResponseToValidableObject(response, keywords){
    let array = [];
    for (let index = 0; index < response.data.length; index++) {
      array.push({uri:response.data[index], isDownloadable: this.checkIfDownloadable(response.data[index], keywords) });
    }
    return array;
  }

  checkIfDownloadable(uri, keywords){
    return uri.match(`/${keywords}/g`) != null;
  }

  async getLinksFromUrl(url){
    return new Promise((resolve, reject)=>{
      url = url.replace(/\?/g, '%3F');
      let request = this.apiService.scrape(url);
      request.pipe(finalize(() => { this.finalizeRequest(url) })).subscribe((response)=>{
        resolve(response);
      });
    });
  }

  finalizeRequest(url){
    this.progress.index += 1;
    this.progress.status = "Finished: "+url;
    this.progress.value = this.progress.index / this.progress.length;
  } 

  round(value){
    return Math.round(value);
  }

  showAlert(head, msg){
    let alert = this.alertController.create({
      message:msg,
      header: head,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }


}
