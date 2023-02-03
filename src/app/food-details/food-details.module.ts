import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodDetailsPage } from './food-details.page';
import { FoodDetailsPageRoutingModule } from './food-details-routing.module';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FoodDetailsPageRoutingModule
  ],
  declarations: [FoodDetailsPage]
})
export class FoodDetailsPageModule {}
