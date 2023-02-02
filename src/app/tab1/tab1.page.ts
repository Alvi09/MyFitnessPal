import { Component, OnInit } from '@angular/core';
import { Tab1Service } from './tab1.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  constructor(private tab1Service: Tab1Service) {}

  ngOnInit(): void {
    this.tab1Service.getFoodsList().subscribe((res) => {
      console.log(res);
    })
  }

}
