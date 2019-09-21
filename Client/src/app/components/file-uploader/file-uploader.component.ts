import { Component, OnInit } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;


  constructor() { }

  ngOnInit() {}

  getFiles(): FileLikeObject[] {
    const mapper = this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
    console.log("mapper",mapper);
    return mapper;
  }

  fileOverBase(ev): void {
    this.hasBaseDropZoneOver = ev;
  }

  reorderFiles(reorderEvent: CustomEvent): void {
    let element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
    this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
    reorderEvent.detail.complete();
    console.log("queue", this.uploader.queue);
  }

}
