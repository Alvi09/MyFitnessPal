import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

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
            console.log("Name: ", alertData.my_name);
          }
        }],
      inputs: [
        {
          name: "my_name",
          placeholder: 'Name',
        },
        {
          name: "my_age",
          type: 'number',
          placeholder: 'Age',
          min: 1,
          max: 100,
        },
        {
          name: "my_height",
          placeholder: "Height"
        },
        {
          name: "my_weight",
          type: 'number',
          placeholder: 'Weight',
          min: 1,
          max: 1000,
        },
        {
          name: "my_gender",
          placeholder: "Gender"
        },
      ],
    });

    await alert.present();

  }
}
