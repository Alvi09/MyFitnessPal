import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Directive, Output, EventEmitter, Input, SimpleChange} from '@angular/core';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userInfo: any[] = [];
  informationEntered = true
  calories = 0
  protein = 0
  carbs = 0
  fat = 0
  macro_list: any[] = [];
  food_list: any[] = [];
  total_macros = {"energy": 0, "protein": 0, "carbs": 0, "fat": 0}

  constructor(private alertController: AlertController, private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.food_list = params['food_list'];
      this.macro_list = params['macro_list'];
      this.total_macros = params['total_macros']
      console.log(this.food_list)
    });
  }


  async enter_info()
  {
    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            // console.log("Selected gender: ", alertData.gender);
            // console.log("Selected goal: ", alertData.goal);
            // const selectedGender = Object.values(alertData.gender).find(value => value === 'male' || value === 'female');
            // console.log("Selected gender: ", alertData.gender);
            // const selectedGoals = Object.values(alertData.goal).filter(value => value === 'loss' || value === 'gain' || value === 'maintain');
            // console.log("Selected goal: ", alertData.goal);
            //console.log("Selected gender: ", alertData.gender);
            const name = alertData.name;
            const age = alertData.age;
            const height = alertData.height;
            const weight = alertData.weight;
            let goal = ""
            let gender = ""

            if (alertData.gender == 1) {
              gender = "male";
            } else if (alertData.gender == 2) {
              gender = "female"
            }
            if (alertData.goal == 1) {
              goal = "loss"
            } else if (alertData.goal == 2) {
              goal = "maintain"
            } else if (alertData.goal == 3) {
              goal = "gain"
            }  

            this.userInfo[0] = ({name: name, age: age, height: height, weight: weight, gender: gender, goal: goal});

            // fix calculations
            if (gender == 'male')
              this.calories = Math.floor((88.362 + (13.397 * this.userInfo[0].weight) + (4.799 * this.userInfo[0].height) - (5.677 * this.userInfo[0].age)) * 1.55)
            else
              this.calories = Math.floor((447.593 + (9.247 * this.userInfo[0].weight) + (3.098 * this.userInfo[0].height) - (4.330 * this.userInfo[0].age)) * 1.55)
            if (goal == 'loss')
              this.calories -= 500
            else if (goal == 'gain')
              this.calories += 500

            this.protein = Math.floor(this.calories * .07)
            this.carbs = Math.floor(this.calories * .05)
            this.fat = Math.floor(this.calories * .03333)

            console.log(this.userInfo);
            this.informationEntered = false;
          }
      }],
      inputs: [
        {
          name: "name",
          placeholder: 'Name',
        },
        {
          name: "age",
          type: 'number',
          placeholder: 'Age',
          min: 1,
          max: 100,
        },
        {
          name: "height",
          placeholder: "Height (cm)"
        },
        {
          name: "weight",
          type: 'number',
          placeholder: 'Weight (kg)',
          min: 1,
          max: 1000,
        },
        {
          name: "gender",
          type: 'number',
          placeholder: 'Gender:1(M),2(F)',
          min: 1,
          max: 2,
        },
        {
          name: "goal",
          type: 'number',
          placeholder: 'Goal:1(loss),2(maintain),3(gain)',
          min: 1,
          max: 3,
        },
      ],
      });
      
      await alert.present();
  }
}
