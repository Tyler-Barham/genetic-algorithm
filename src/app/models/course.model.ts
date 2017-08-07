import { Ingredient } from './ingredient.model';
import { CourseIngredient } from './courseIngredient.model';

export class Course {
    name: string = "";
    ingredients: Array<CourseIngredient> = new Array<CourseIngredient>();
    courseTime: Array<CourseTime> = new Array<CourseTime>();

    public getIngredients(): Array<CourseIngredient> {
        return this.ingredients;
    }

    public addIngredient(ingredient: Ingredient, quantity: number): void {
        this.ingredients.push(new CourseIngredient(ingredient, quantity));
    }

}

export enum CourseTime {
    breakfast1,
    breakfast2,
    lunch1,
    lunch2,
    lunch3,
    dinner1,
    dinner2,
    dinner3
}