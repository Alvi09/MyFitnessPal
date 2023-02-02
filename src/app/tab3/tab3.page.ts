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
    // Haven't looked into storing this information yet

    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: ['OK'],
      inputs: [
        {
          placeholder: 'Name',
        },
        {
          type: 'number',
          placeholder: 'Weight',
        },
        {
          type: 'number',
          placeholder: 'Age',
          min: 1,
          max: 100,
        },
        {
          placeholder: "Male / Female"
        },
      ],
    });

    await alert.present();

  }
}
