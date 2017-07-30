import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Ingredient } from '../models/ingredient.model';
import { Course } from '../models/course.model';

@Injectable()
export class GeneticAlgorithm {

    private ingredients: Array<Ingredient> = Array<Ingredient>();
    private courses: Array<Course> = Array<Course>();

    constructor(public http: Http) {

    }

    public readIngredients(): Promise<Array<Ingredient>> {
        return this.http.get('assets/ingredients.txt', null)
        .toPromise()
        .then( res => {
            let lines: string[];
            lines = res.text().split(/(?:\r\n|\r|\n)/g);

            lines.forEach(line => {
                let anIngredient: Ingredient;
                let splitLine: string[] = line.split(', ');
                anIngredient = new Ingredient(splitLine[0], splitLine[1]);
                this.ingredients.push(anIngredient);
            });
            return this.ingredients;
        });
    }

    public readCourses(): Promise<Array<Course>> {
        return this.http.get('assets/courses.txt', null)
        .toPromise()
        .then( res => {
            let lines: string[];
            lines = res.text().split(/(?:\r\n|\r|\n)/g);

            lines.forEach(line => {
                let splitLine: string[] = line.split(', ');
                let anIngredient: Ingredient = this.ingredients.find(x => x.name.toLowerCase() == splitLine[1].toLowerCase())
                let aCourse: Course = this.courses.find(x => x.name.toLowerCase() == splitLine[0].toLowerCase());

                if (aCourse == null) {
                    let aCourse: Course = new Course();
                    aCourse.name = splitLine[0];
                    aCourse.addIngredient(anIngredient, parseFloat(splitLine[2]));
                    this.courses.push(aCourse);
                } else {
                    aCourse.addIngredient(anIngredient, parseFloat(splitLine[2]));
                }
            });
            return this.courses;
        });
    }

}