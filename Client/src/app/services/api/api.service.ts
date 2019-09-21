import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private isProd = false;
  private apiUrl: string;
  constructor(private http: HttpClient) { 
    if(!this.isProd) this.apiUrl = 'http://localhost:4200';
    else this.apiUrl = 'http://newDomain:4200';
  }

  scrape(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scrape/${url}`).pipe(
      map(results => results)
    );
  }

  request(url:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/request/${url}`).pipe(
      map(results => results)
    );
  }

}
