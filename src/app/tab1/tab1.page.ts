import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tab1Service } from './tab1.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page implements OnInit {
  foods: any[] = [];
  currentNutrient = undefined;
  nutrients: any[] = [];

  selected = 0;
  currentPage = 1;
  sortingOrder = 'desc'

  sortResultsSheetOption = {
    header: 'Sort Options',
    subHeader: 'Select a sorting option',
  }


  constructor(private tab1Service: Tab1Service, private loadingCtrl: LoadingController) {}


  ngOnInit(): void {}

  showOneEntry(item: any) {
    this.selected = item.id;
  }


  async getData(searchQuery: Event) {    
    this.foods = [];
    this.nutrients = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present()

    const raw_query = (searchQuery.target as HTMLInputElement).value;
    console.log(`search query: ${raw_query}`);

    const query = raw_query.replace(/ /g, '%20');

    this.tab1Service.getFoodsList(query).subscribe((res: any) => {
      loading.dismiss();
      console.log('response', res);

      Object.keys(res).forEach((key: any) => {
        const id = res[key].fdcId;
        const name = res[key].description;
        const publicationDate = res[key].publicationDate;
        const nutrients = res[key].foodNutrients;
        const brandOwner = res[key].brandOwner

        const d = {id: id, name: name, publicationDate: publicationDate, nutrients: nutrients, brandOwner: brandOwner, sortHelper: -1};
        this.foods.push(d);

        // extract all nutrients from search results
        var nutrientIndex = 0;
        for (var nutrient in nutrients) {
          const nutrientName = nutrients[nutrient].name;
          
          // only keep unique values, no duplicates
          const nutrientNamesList = this.nutrients.map(function (n) { return n.name; });
          if(nutrientNamesList.indexOf(nutrientName) === -1) {
            this.nutrients.push({id: nutrientIndex, name: nutrientName});
            nutrientIndex += 1;
          }
        }
      });
      
      console.log('results', this.foods);
      console.log('nutrients', this.nutrients);

    });
  };

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.name === o2.name : o1 === o2;
  }

  changeNutrient(ev: any) {
    this.currentNutrient = ev.target.value;
    const targetNutrient = ev.target.value;

    console.log(`nutrient to filter: ${targetNutrient.name}`);
    // console.log(`sort order: ${this.sortingOrder}`)  // work on sorting order if have time
    
    for (var food in this.foods) {
      const foodNutrients = this.foods[food].nutrients;

      for (var key in foodNutrients) {
        if (foodNutrients[key].name === targetNutrient.name) {
          this.foods[food].sortHelper = foodNutrients[key].amount
          break
        }
      }
    }

    this.foods.sort(function(a, b) {
      return b.sortHelper - a.sortHelper
    })
    // console.log(this.foods)
  }

}