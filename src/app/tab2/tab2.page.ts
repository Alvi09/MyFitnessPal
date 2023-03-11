import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tab2Service } from './tab2.service';
import { NavController } from '@ionic/angular';


const page_numbers = 5;


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {
  // https://en.wikipedia.org/wiki/List_of_diets
  public diets = ["Low calorie diet", "Low carbohydrate diet", "Low fat diet", "Keto diet", "GERD diet"];
  public results = [...this.diets];
  public foods: any = {};
  public food_categories: Array<String> = [];

  constructor(private tab2Service: Tab2Service, private loadingCtrl: LoadingController, private navController: NavController) {}

  // load all data before any actions take place
  ngOnInit(): void {
    for (var i = 0; i < 5; i++) {
      const foods_list = [];

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

          const d = {id: id, name: name, publicationDate: publicationDate, nutrients: nutrients, foodCategory: foodCategory, score: score, sortHelper: -1};
          // console.log(d);

          if (!this.food_categories.includes(foodCategory)) {
            this.food_categories.push(foodCategory);
            this.foods[foodCategory] = [d];
          } else {
            this.foods[foodCategory].push(d);
          }
        })
      })

      // console.log('food_categories', this.food_categories)
    }
    console.log("foods", this.foods);
  }

  // work on getting recommendations for different diets
  async getRecommendations(event: any) {
    const chosenDiet = event.target.innerText
    console.log(chosenDiet);
    
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();


    loading.dismiss();
  };


  searchFilter(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.diets.filter(d => d.toLowerCase().indexOf(query) > -1);
  }

  sleep() {
    return new Promise(resolve => setTimeout(resolve, 5000));
  }

}
