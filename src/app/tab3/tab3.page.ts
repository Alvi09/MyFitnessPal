import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';

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
  constructor(private alertController: AlertController) {}


  async enter_info()
  {
    // Not done, need to actually store given inputs into variables, but right now just logging them out

    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            // console.log("Name: ", alertData.my_name);
            const name = alertData.name;
            const age = alertData.age;
            const height = alertData.height;
            const weight = alertData.weight;
            const gender = alertData.gender;   
            const goal = alertData.goal        
            this.userInfo[0] = ({name: name, age: age, height: height, weight: weight, gender: gender, goal: goal});
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
            placeholder: "Gender (m/f)"
          },
          {
            name: "goal",
            placeholder: "loss/gain/maintain"
          },
        ],
      });
      
      await alert.present();
  }
}
