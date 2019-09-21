import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { FileManagerService } from  '../../services/file-manager/file-manager.service';
import { Storage } from '@ionic/storage';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-multi-file-upload',
  templateUrl: './multi-file-upload.component.html',
  styleUrls: ['./multi-file-upload.component.scss'],
})
export class MultiFileUploadComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;
  public contentArray: any[] = [];
  loadEnabled: boolean = true;

  @ViewChild('loadbutton', {read: ElementRef, static: true}) loadButton : ElementRef;

  constructor( private filService: FileManagerService, public storage: Storage) { }

  ngOnInit() {

    this.changeButtonState(false);
    this.uploader.onAfterAddingFile = (fileItem)=>{
      this.changeButtonState(true);
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any)=>{
      this.contentArray.push(item);
      this.processUploadedItem(item);
    }
  }

  processUploadedItem(item){
    let reader_ = new FileReader();
    reader_.readAsArrayBuffer(item._file);
    reader_.onload = (ev)=> {
      this.processFileContents(reader_.result);
    }

    if(this.contentArray.length == this.uploader.queue.length){
      this.cleanUploaderQueue();
    }
  }

  getFiles(): FileLikeObject[] {
    const mapper = this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
    return mapper;
  }

  fileOverBase(ev): void {
    this.hasBaseDropZoneOver = ev;
  }

  reorderFiles(reorderEvent: CustomEvent): void {
    let element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
    this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
    reorderEvent.detail.complete();
  }

  removeFile(item){
    this.uploader.removeFromQueue(item);
    if(this.uploader.queue.length<1) this.changeButtonState(false);
  }

  isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
  }

  uploadFilesToService(){
    this.uploader.queue.forEach(element => {
      this.uploader.uploadItem(element);
    });
  }

  processFileContents(data){
    let promisesForContents = [];
    let d = new Uint8Array(data);
    let workbook = XLSX.read(d, {type: 'array'});
    workbook.SheetNames.forEach( element => {
        promisesForContents.push(this.getPromisedContent(workbook, element));
    });

    Promise.all(promisesForContents).then(()=>{
      this.storage.remove('urlData').then(()=>{
        this.storage.set('urlData', [...this.contentArray]);
        this.contentArray = [];
      });
    });
  }

  getPromisedContent(book, contentSource){
    return new Promise((resolve, reject)=>{
      if(book && contentSource){
        this.contentArray.push(XLSX.utils.sheet_to_json(book.Sheets[contentSource]));
        resolve();
      }else 
        reject();
    });
  }

  cleanUploaderQueue(){
    this.uploader.queue = [];
    this.contentArray = [];
    this.changeButtonState(false);
  }

  uploadData(target){
    //console.log("target adquired",target);
  }

  changeButtonState(flag){
    this.loadEnabled = flag;
    this.loadButton.nativeElement.disabled =  !this.loadEnabled;
  }

}
