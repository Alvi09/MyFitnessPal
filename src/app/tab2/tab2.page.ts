import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tab2Service } from './tab2.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {

  constructor(private loadingCtrl: LoadingController, private navController: NavController) {}

  ngOnInit(): void {}




  // work on getting recommendations for different diets
  // https://en.wikipedia.org/wiki/List_of_diets
  async getRecommendations(searchQuery: Event) {

  }


}
