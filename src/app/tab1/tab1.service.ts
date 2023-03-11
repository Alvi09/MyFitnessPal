import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



const base_url = environment.base_url;
const api_key = environment.apiKey;
const endpoint = 'foods/list'
const page_number = '1'
const page_size = '100'


@Injectable({
  providedIn: 'root',
})


export class Tab1Service {

  constructor(private http: HttpClient) {}

  // api guide: https://fdc.nal.usda.gov/api-guide.html#bkmk-2
  // endpoints: https://fdc.nal.usda.gov/api-spec/fdc_api.html#/

  getFoodsList(query: string): Observable<any> {
    const url = `${base_url}${endpoint}?api_key=${api_key}&pageSize=${page_size}&query=${query}`;
    console.log(`url: ${url}`);
    return this.http.get(url);
  }

}