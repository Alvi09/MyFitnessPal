import { Component, OnInit } from '@angular/core';
import { Tab1Service } from './tab1.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  constructor(private tab1Service: Tab1Service) {}

  getData(searchQuery: Event) {    

    const raw_query = (searchQuery.target as HTMLInputElement).value;
    console.log(`search query: ${raw_query}`);

    const query = raw_query.replace(/ /g, '%20');

    this.tab1Service.getFoodsList(query).subscribe((res) => {

    });
  };


  ngOnInit(): void {
    // this.tab1Service.getFoodsList().subscribe((res) => {
    //   console.log(res);
    // })
  }

}
