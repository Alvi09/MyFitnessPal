import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tab1Service } from './tab1.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page implements OnInit {
  foods: any[] = [];
  selected = 0;
  currentPage = 1;


  constructor(private tab1Service: Tab1Service, private loadingCtrl: LoadingController) {}


  ngOnInit(): void {}

  showOneEntry(item: any) {
    this.selected = item.id;
  }


  async getData(searchQuery: Event) {    
    this.foods = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present()

    const raw_query = (searchQuery.target as HTMLInputElement).value;
    console.log(`search query: ${raw_query}`);

    const query = raw_query.replace(/ /g, '%20');

    this.tab1Service.getFoodsList(query).subscribe((res: any) => {
      loading.dismiss();
      console.log(res);

      Object.keys(res).forEach((key: any) => {
        const id = res[key].fdcId;
        const name = res[key].description;
        const publicationDate = res[key].publicationDate;
        const nutrients = res[key].foodNutrients;
        const brandOwner = res[key].brandOwner

        const d = {id: id, name: name, publicationDate: publicationDate, nutrients: nutrients, brandOwner: brandOwner};
        this.foods.push(d);
      });

      console.log(this.foods);

    });
  };

}