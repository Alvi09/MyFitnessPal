import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



const base_url = environment.base_url;
const api_key = environment.apiKey;
const endpoint = 'foods/list'


@Injectable({
  providedIn: 'root',
})


export class Tab1Service {

  constructor(private http: HttpClient) {}

  getFoodsList(query: string): Observable<any> {
    const url = `${base_url}${endpoint}?api_key=${api_key}&query=${query}`;
    console.log(`url: ${url}`);
    return this.http.get(url);
  }

}
