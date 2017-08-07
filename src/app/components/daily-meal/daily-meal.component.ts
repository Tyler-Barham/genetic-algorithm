import { Component, OnInit, Input } from '@angular/core';
import { DailyMeal } from '../../models/dailyMeal.model';

@Component({
  selector: 'app-daily-meal',
  templateUrl: './daily-meal.component.html',
  styleUrls: ['./daily-meal.component.css']
})
export class DailyMealComponent implements OnInit {

  @Input()
  meal: DailyMeal

  constructor() { }

  ngOnInit() {
  }

  ngOnChange() {
  }

  toggleAccordian($event) {
    let div: HTMLElement = $event.target.nextElementSibling;

    if (div.style.maxHeight) {
      div.style.maxHeight = null;
    } else {
      div.style.maxHeight = "0";
    }
  }

}
