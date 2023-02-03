import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-food-details',
  templateUrl: 'food-details.page.html',
  styleUrls: ['food-details.page.scss']
})



export class FoodDetailsPage implements OnInit {
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
    }

}
