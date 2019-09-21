import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class XlsxManagerService {

  constructor() { }
}
