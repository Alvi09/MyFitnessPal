import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userInfo: any[] = [];

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

            this.userInfo[0] = ({name: name, age: age, height: height, weight: weight, gender: gender});
            console.log(this.userInfo);
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
          placeholder: "Height"
        },
        {
          name: "weight",
          type: 'number',
          placeholder: 'Weight',
          min: 1,
          max: 1000,
        },
        {
          name: "gender",
          placeholder: "Gender"
        },
      ],
    });

    await alert.present();

  }
}
