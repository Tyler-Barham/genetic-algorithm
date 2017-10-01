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
  private currentInput: string = "";
  private ingredients: Array<Ingredient> = new Array<Ingredient>();
  private allIngredients: Array<Ingredient> = new Array<Ingredient>();

  constructor(public geneticAlgorithm: GeneticAlgorithm) {
    this.getDataFromTextFiles();
    this.allIngredients = this.geneticAlgorithm.getIngredients();
  }

  private getDataFromTextFiles(): void {
    this.geneticAlgorithm.readTextFiles().then(() => {
      console.log("Finished reading files");
    });
  }

  private startGeneticAlgorith(): void {
    this.geneticAlgorithm.fillInitialPopulation(this.ingredients)
    this.initialPrice = this.geneticAlgorithm.findCheapestMeal().price;
    
    this.startAsyncReproduction().then(() => {
      console.log("in then");
      this.getCheapestMeal();
      this.generations = 0;
    }).catch(() => {
      console.log("in catch");
    });
  }

  private getCheapestMeal(): void {
    this.weeklyMeal = this.geneticAlgorithm.findCheapestMeal();
  }

  private async startAsyncReproduction(): Promise<void> {
    let endTime: Date = new Date();
    console.log("Started at:", endTime.toTimeString());
    //endTime.setMinutes(endTime.getMinutes() + 5);
    endTime.setSeconds(endTime.getSeconds() + 10);

    while (new Date() < endTime) {
      //console.log("Generation: " + this.generations);
      await this.geneticAlgorithm.createChildPopulation();
      this.generations++;
    }
    
    console.log("Finished at:", new Date().toTimeString());
    console.log("Generations: ", this.generations);
  }

  private addExclusion(): void {
    let newExclusion = this.currentInput;

    //Attempt to find an ingredient object
    let foundIng = this.allIngredients.find(ing => ing.name.toLowerCase() == newExclusion.toLowerCase());
    
    //Make new ingredient if one wasn't found
    if (foundIng == undefined) {
      foundIng = new Ingredient(newExclusion, 0);
    }

    //Stop duplicates
    if (!this.ingredients.find(ing => ing.name.toLowerCase() == newExclusion.toLowerCase())) {
      this.ingredients.push(foundIng);
    }

    //Clear input
    this.currentInput = "";
  }

  removeIngredient(ingredient: Ingredient): void {
    let index: number = this.ingredients.indexOf(ingredient);
    if (index !== -1) {
        this.ingredients.splice(index, 1);
    } 
  }

}
