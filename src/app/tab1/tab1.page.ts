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
  //ingredients: any[] = [];
  selected = 0;
  currentPage = 1;
  sortingOrder = 'desc'
  minCalories = 0;
  minProtein = 0;
  minCarbs = 0;
  minFat = 0;
  //macros: any[] = [];
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
    //this.ingredients = [];
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
        //const ingredients = res[key].ingredients
        const d = {id: id, name: name, publicationDate: publicationDate, nutrients: nutrients, brandOwner: brandOwner, sortHelper: -1};
        this.foods.push(d);
        //need to filter out foods with user allergy.
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
      //console.log('ingredients', this.foods[0].ingredients);
    });
  };

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.name === o2.name : o1 === o2;
  }


  filterFoods() {
    //currently not filtering correctly. Either does not remove food item or removes all food items.
    const macros = [
      { name: "Protein", min: this.minProtein },
      { name: "Total lipid (fat)", min: this.minFat },
      { name: "Carbohydrate, by difference", min: this.minCarbs },
      { name: "Energy", min: this.minCalories }
    ];
    this.foods = this.foods.filter((food) => {
      for (const macro of macros) {
        console.log(`minimums set: ${macro.min}`);
        for (var foodItem in this.foods) {
          const foodNutrients = this.foods[foodItem].nutrients;
          for (var key in foodNutrients) {
            if (foodNutrients[key].name == macro.name && foodNutrients[key].amount < macro.min) {
              console.log(`removed: ${foodNutrients[key].amount}`);
              return false;
            }
            else if (foodNutrients[key].name == macro.name && foodNutrients[key].amount >= macro.min){
              return true;
            }
          }
        }   
      }
      return true;
    });
  
    this.foods.sort(function(a, b) {
      return b.sortHelper - a.sortHelper;
    });
  }

  // filterFoods(){
  //   //this.macros = ["Protein", "Total lipid (fat)", "Carbohydrate, by difference", "Energy"]
  //   const macros = [
  //     { name: "Protein", min: this.minProtein },
  //     { name: "Total lipid (fat)", min: this.minFat },
  //     { name: "Carbohydrate, by difference", min: this.minCarbs },
  //     { name: "Energy", min: this.minCalories }
  //   ];
  //   for (const macro in macros){
  //     console.log(`minimums set: ${macros[macro].min}`);
  //     for (var food in this.foods) {
  //       const foodNutrients = this.foods[food].nutrients;
  //       for (var key in foodNutrients) {
  //         if (foodNutrients[key].name == macros[macro].name && foodNutrients[key].amount >= macros[macro].min) {
  //           console.log(`macro name': ${foodNutrients[key].name}`);
  //           this.foods[food].sortHelper = foodNutrients[key].amount
  //           break
  //       }
  //     }
  //   }
  // }
  // this.foods.sort(function(a, b) {
  //   return b.sortHelper - a.sortHelper
  // })
  // }


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