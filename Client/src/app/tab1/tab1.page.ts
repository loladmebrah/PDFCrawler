import { Component, ViewChild, ElementRef } from '@angular/core';
import { MultiFileUploadComponent } from '../components/multi-file-upload/multi-file-upload.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  @ViewChild('uploader', { read: ElementRef, static: true}) fileField: MultiFileUploadComponent;
  
  constructor() {}
}
