import { Component } from '@angular/core';

import { GeneticAlgorithm } from './services/genetic-algorithm.service';
import { Ingredient } from './models/ingredient.model';
import { Course } from './models/course.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public ingredients: Array<Ingredient>;
  public courses: Array<Course>;

  constructor(public geneticAlgorithm: GeneticAlgorithm) {
    this.getDataFromTextFiles();
  }

  private getDataFromTextFiles(): void {
    this.geneticAlgorithm.readIngredients().then(res => {
      this.ingredients = res;
      console.log(this.ingredients);

      this.geneticAlgorithm.readCourses().then(res => {
        this.courses = res;
        console.log(this.courses);
      });
    });
  }
}
