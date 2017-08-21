import { Component } from '@angular/core';

import { GeneticAlgorithm } from './services/genetic-algorithm.service';
import { Ingredient } from './models/ingredient.model';
import { Course } from './models/course.model';
import { DailyMeal } from './models/dailyMeal.model';
import { CourseIngredient } from './models/courseIngredient.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public meals: Array<DailyMeal>;
  public price: string;

  constructor(public geneticAlgorithm: GeneticAlgorithm) {
    this.getDataFromTextFiles();
  }

  private getDataFromTextFiles(): void {
    this.geneticAlgorithm.readTextFiles().then(res => {
      console.log(res);
      this.getNewMeals();
    });
  }

  private getNewMeals(): void {
    this.meals = this.geneticAlgorithm.generateWeeklyMeals();

    let price: number = 0;

    this.meals.forEach(meal => {
      price += this.calculatePrice(meal.breakfast1.ingredients);
      price += this.calculatePrice(meal.breakfast2.ingredients);
      price += this.calculatePrice(meal.lunch1.ingredients);
      price += this.calculatePrice(meal.lunch2.ingredients);
      price += this.calculatePrice(meal.lunch3.ingredients);
      price += this.calculatePrice(meal.dinner1.ingredients);
      price += this.calculatePrice(meal.dinner2.ingredients);
      price += this.calculatePrice(meal.dinner3.ingredients);
    });
    
    this.price = price.toFixed(2);
  }

  private calculatePrice(array: Array<CourseIngredient>): number {
    let price: number = 0;
    array.forEach(element => {
      price += element.ingredient.price * element.quantity;
    });
    return price;
  }
}
