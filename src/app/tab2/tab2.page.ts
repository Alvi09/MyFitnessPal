import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tab2Service } from './tab2.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {
  // https://en.wikipedia.org/wiki/List_of_diets
  public diet_options = ["Low calorie diet", "Low carbohydrate diet", "Low fat diet", "Keto diet", "GERD diet", "Lactose-free diet"];  // list of possible diets to choose from
  public diets = [...this.diet_options];
  public foods_data: any = {};                     // dynamic object to hold data of foods provided by API response
  public food_categories: Array<String> = [];      // list of possible food categories 
  public recommended_results: any = {};            // dynamic object to hold the recommendations based on chosen diet
  public recommended_results_display: any[] = [];  // helper dynamic object to to show the recommendations on display for the user
  public food_list: any[] = [];                    // dynamic object to hold foods that the user adds to their list
  public macro_list: any[] = [];                   // list of macros pertaining to the user
  public total_macros = {"energy": 0, "protein": 0, "carbs": 0, "fat": 0}
  diet_clickedButton = false;
  chosen_diet = "";


  constructor(private tab2Service: Tab2Service, private loadingCtrl: LoadingController, private navController: NavController, private alertController: AlertController) {}
  navigateToPage3() {
    this.navController.navigateForward('tabs/tab3', {
      queryParams: { food_list: this.food_list,
                      macro_list: this.macro_list,
                      total_macros: this.total_macros},
    });
  }


  // load all data before any actions take place
  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
      spinner: 'bubbles',
    });
    await loading.present();

    // going through all possible pages of data to extract generic foods and their details
    for (var i = 0; i < 5; i++) {
      await this.sleep(500);
      
      // grab response from tab2.service.ts
      this.tab2Service.getFoundationFoods(i+1).subscribe((res: any) => {
        const food_results = res['foods'];
        // console.log(food_results);

        Object.keys(food_results).forEach((key: any) => {
          const id = food_results[key].fdcId;
          const name = food_results[key].description;
          const publicationDate = food_results[key].publicationDate;
          const nutrients = food_results[key].foodNutrients;
          const foodCategory = food_results[key].foodCategory;
          const score = food_results[key].score;

          const d = {id: id, name: name, publicationDate: publicationDate, nutrients: nutrients, foodCategory: foodCategory, score: score, sortHelper: 0};
          // console.log(d);

          if (!this.food_categories.includes(foodCategory)) {
            this.food_categories.push(foodCategory);
            this.foods_data[foodCategory] = [d];
          } else {
            this.foods_data[foodCategory].push(d);
          }
        })
      })

      // console.log('food_categories', this.food_categories)
    }

    loading.dismiss();
    console.log("foods", this.foods_data);
  }

  // nutritional amounts are based on every 100 grams of that food
  async getRecommendations(event: any) {
    this.chosen_diet = event.target.innerText
    var diet_type = "low";
    console.log(this.chosen_diet);

    if (this.chosen_diet.toLowerCase().includes("low")) {
      diet_type = "low";
    } 
    
    if (this.chosen_diet.toLowerCase().includes("keto")) {
      diet_type = "keto";
    }
    
    const loading = await this.loadingCtrl.create({
      message: 'Recommending foods...',
      spinner: 'bubbles',
    });
    await loading.present();
    await this.sleep(3000);

    this.recommended_results = this.foods_data;

    // sort each category by low/high diet (e.g. calorie, carbohydrate, etc.)
    for (var foodCategory in this.foods_data) {
      const foods_list = this.foods_data[foodCategory];

      console.log(foodCategory, foods_list)

      for (var food in foods_list) {
        const foodNutrients = foods_list[food].nutrients;
        let nutrient_amount = 0;
        let grams_amount = 100;
  
        for (var key in foodNutrients) {
          // low calorie diet
          if (this.chosen_diet.toLowerCase() === "low calorie diet") {
            if (foodNutrients[key].unitName == 'KCAL') {
              nutrient_amount = foodNutrients[key].value;
              grams_amount = 100;
  
              break;
            } 
          }

          // low carbohydrate diet
          if (this.chosen_diet.toLowerCase() === "low carbohydrate diet") {
            if (foodNutrients[key].nutrientName == 'Carbohydrate, by difference') {
              nutrient_amount = foodNutrients[key].value;
              grams_amount = 100;
  
              break;
            }
          }

          // low fat and gerd diet
          if (this.chosen_diet.toLowerCase() === "low fat diet" || this.chosen_diet.toLowerCase() === "gerd diet") {
            if (foodNutrients[key].nutrientName == 'Total fat (NLEA)') {
              nutrient_amount = foodNutrients[key].value;
              grams_amount = 100;
  
              break;
            }
          }

          // keto diet (high fat, moderate protein, very low carbs)
          if (this.chosen_diet.toLowerCase() === "keto diet") {
            if (foodNutrients[key].nutrientName == 'Total lipid (fat)') {
              nutrient_amount = foodNutrients[key].value;
              grams_amount = 100;
  
              break;
            }
          }

          // lactose-free diet
          if (this.chosen_diet.toLowerCase() === "lactose-free diet") {
            if (foodNutrients[key].nutrientName == 'Lactose' && foodNutrients[key].value === 0) {
              nutrient_amount = foodNutrients[key].value;
              grams_amount = 100;
  
              break;
            }
          }
        }

        // console.log(`${foods_list[food].name} has ${nutrient_amount} ${foodNutrients[key].unitName} for every ${grams_amount} grams`);
        this.recommended_results[foodCategory][food].sortHelper = nutrient_amount;
        this.recommended_results[foodCategory][food]['servingAmount'] = grams_amount;
      }

      this.recommended_results[foodCategory].sort(function(a: any, b: any) {
        if (diet_type === "low") {
          return a.sortHelper - b.sortHelper
        }

        // possible future improvement to use multiple sorting for certain diets

        return b.sortHelper - a.sortHelper;
      })
    }

    for (var k in this.recommended_results) {
      // extract top n results
      this.recommended_results[k] = this.recommended_results[k].slice(0, 3);

      for (var foodk of this.recommended_results[k]) {
        this.recommended_results_display.push(foodk);
      }
    }

    console.log('recommended results', this.recommended_results);
    loading.dismiss();

    // redirect to a separate page that will display the recommendation results
    this.diet_clickedButton = true;
  };

  // helper function to filter search results while user types in query
  searchFilter(event: any) {
    const query = event.target.value.toLowerCase();
    this.diets = this.diet_options.filter(d => d.toLowerCase().indexOf(query) > -1);
  }

  // show details of foods
  async showDetails(foodName: any, foodCategory: any) {
    // console.log(foodName);
    // console.log(foodCategory);

    var details_msg = ""
    for (var food of this.recommended_results[foodCategory]) {
      for (var nutrient of food.nutrients) {
        details_msg = details_msg + `${nutrient.nutrientName} - ${nutrient.value} ${nutrient.unitName} <br/>`
      }
    }

    const alert = await this.alertController.create({
      header: foodName,
      subHeader: foodCategory,
      buttons: ['Ok'],
      message: details_msg
    });

    await alert.present();
  }

  // add food to user list for macro calculations
  add_food = (item: any) => {
    this.food_list.push(item);
    let macro = {
      "energy": 0,
      "protein": 0,
      'carbs': 0,
      'fat': 0
    };
    console.log(this.food_list)
    console.log(item.nutrients)
    for (let i = 0; i < item.nutrients.length; i++) {
      if (item.nutrients[i].nutrientName == "Energy" && item.nutrients[i].unitName == "kJ") {
        // console.log(item.nutrients[i].nutrientName);
        // console.log(item.nutrients[i].unitName);
        // console.log(item.nutrients[i].value)
        macro['energy'] = item.nutrients[i].value
        this.total_macros['energy'] += item.nutrients[i].value;
      }
      else if (item.nutrients[i].nutrientName == "Carbohydrate, by difference") {
        this.total_macros['carbs'] += item.nutrients[i].value;
        macro['carbs'] = item.nutrients[i].value
      }
      else if (item.nutrients[i].nutrientName == "Protein") {
        this.total_macros['protein'] += item.nutrients[i].value;
        macro['protein'] = item.nutrients[i].value
      }
      else if (item.nutrients[i].nutrientName == "Total lipid (fat)") {
        this.total_macros['fat'] += item.nutrients[i].value;
        macro['fat'] = item.nutrients[i].value
      }
    } 

    this.macro_list.push(macro);
    this.navigateToPage3();
  }

  // function to reset page material
  async goBack() {
    const loading = await this.loadingCtrl.create({
      message: 'Going back...',
      spinner: 'bubbles',
    });
    await loading.present();
    await this.sleep(1000);

    this.diet_clickedButton = false;
    await loading.dismiss();
  };

  // sleep function for timing purposes and giving time for API to make calls
  sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

}
