import { Component, OnInit, Input } from '@angular/core';
import { DailyMeal } from '../../models/dailyMeal.model';

@Component({
  selector: 'app-daily-meal',
  templateUrl: './daily-meal.component.html',
  styleUrls: ['./daily-meal.component.css']
})
export class DailyMealComponent implements OnInit {

  @Input()
  meals: Array<DailyMeal>

  constructor() { }

  ngOnInit() {
  }

  ngOnChange() {
  }

  toggleAccordian($event) {
    let div: HTMLElement = $event.target.parentElement.nextElementSibling;

    if (div.style.display) {
      div.style.display = null;
    } else {
      div.style.display = "table-row";
    }
  }

}
