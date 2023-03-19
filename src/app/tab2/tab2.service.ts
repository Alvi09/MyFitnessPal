import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const base_url = environment.base_url;
const api_key = environment.apiKey;
const data_type = 'Foundation'
const endpoint = 'foods/search';


@Injectable({
  providedIn: 'root',
})


export class Tab2Service {

    constructor(private http: HttpClient) {}

    // api guide: https://fdc.nal.usda.gov/api-guide.html#bkmk-2
    // endpoints: https://fdc.nal.usda.gov/api-spec/fdc_api.html#/
    // search:    https://fdc.nal.usda.gov/fdc-app.html#/
    
    getFoundationFoods(pageNumber: Number): Observable<any> {
      const url = `${base_url}${endpoint}?api_key=${api_key}&dataType=${data_type}&pageNumber=${pageNumber}`;  // build url
      // console.log(`url: ${url}`);

      return this.http.get(url);
    }
}