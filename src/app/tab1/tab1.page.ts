import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tab1Service } from './tab1.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page implements OnInit {
  foods: any[] = [];            // dynamic object to hold food data
  currentNutrient = undefined;  // track the nutrient that is being filtered from search results
  nutrients: any[] = [];        // dynamic object to hold all possible nutrients
  food_list: any[] = [];        // dynamic object to hold foods that the user adds to their list
  macro_list: any[] = [];       // list of macros pertaining to the user
  total_macros = {"energy": 0, "protein": 0, "carbs": 0, "fat": 0}
  

  // allow user to add a certain food to their stored list
  add_food = (item: any) => {
    this.food_list.push(item);
    let macro = {
      "energy": 0,
      "protein": 0,
      'carbs': 0,
      'fat': 0
    };
    console.log(this.food_list);

    for (let i = 0; i < item.nutrients.length; i++) {
      if (item.nutrients[i].name == "Energy") {
        macro['energy'] = item.nutrients[i].amount
        this.total_macros['energy'] += item.nutrients[i].amount;
      }
      else if (item.nutrients[i].name == "Carbohydrate, by difference") {
        this.total_macros['carbs'] += item.nutrients[i].amount;
        macro['carbs'] = item.nutrients[i].amount
      }
      else if (item.nutrients[i].name == "Protein") {
        this.total_macros['protein'] += item.nutrients[i].amount;
        macro['protein'] = item.nutrients[i].amount
      }
      else if (item.nutrients[i].name == "Total lipid (fat)") {
        this.total_macros['fat'] += item.nutrients[i].amount;
        macro['fat'] = item.nutrients[i].amount
      }
    } 
    this.macro_list.push(macro);
    this.navigateToPage3();
  }

  selected = 0;
  currentPage = 1;

  constructor(private tab1Service: Tab1Service, private loadingCtrl: LoadingController, private navController: NavController) {}

  navigateToPage3() {
    this.navController.navigateForward('tabs/tab3', {
      queryParams: { food_list: this.food_list,
                      macro_list: this.macro_list,
                      total_macros: this.total_macros},
    });
  }
  
  ngOnInit()  {
    this.navigateToPage3();
  }

  showOneEntry(item: any) {
    this.selected = item.id;
  }

  // grab data from USDA FoodData Central API
  // params are defined in tab1.service.ts
  async getData(searchQuery: Event) {    
    this.foods = [];
    this.nutrients = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present()

    const raw_query = (searchQuery.target as HTMLInputElement).value;  // grab query from user
    console.log(`search query: ${raw_query}`);

    // replace spaces with + or %20 for url purposes
    const query = raw_query.replace(/ /g, '+');

    this.tab1Service.getFoodsList(query).subscribe((res: any) => {
      console.log('response', res);
      
      // extract details from the API response
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
      
      loading.dismiss();
    });
  };

  // helper function for showing one result at a time when clicking 
  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.name === o2.name : o1 === o2;
  }
  
  changeNutrient(ev: any) {
    this.currentNutrient = ev.target.value;
    const targetNutrient = ev.target.value;

    console.log(`nutrient to filter: ${targetNutrient.name}`);
    
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
