import { Component } from '@angular/core';

import { GeneticAlgorithm } from './services/genetic-algorithm.service';
import { Ingredient } from './models/ingredient.model';
import { Course } from './models/course.model';
import { DailyMeal } from './models/dailyMeal.model';
import { CourseIngredient } from './models/courseIngredient.model';
import { WeeklyMeal } from './models/weeklyMeal.model';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public weeklyMeal: WeeklyMeal = new WeeklyMeal();
  private initialPrice: number = 0;
  private generations: number = 0;

  constructor(public geneticAlgorithm: GeneticAlgorithm) {
    this.getDataFromTextFiles();
  }

  private getDataFromTextFiles(): void {
    this.geneticAlgorithm.readTextFiles().then(res => {
      console.log(res);
    });
  }

  private startGeneticAlgorith(): void {
    this.geneticAlgorithm.fillInitialPopulation()
    this.initialPrice = this.geneticAlgorithm.findCheapestMeal().price;
    
    this.startAsyncReproduction().then(() => {
      this.getCheapestMeal();
      this.generations = 0;
    });
  }

  private getCheapestMeal(): void {
    this.weeklyMeal = this.geneticAlgorithm.findCheapestMeal();
  }

  private async startAsyncReproduction() {
    if (this.generations++ < 100) {
      this.geneticAlgorithm.createChildPopulation();
      this.startAsyncReproduction();
    }
  }

}
