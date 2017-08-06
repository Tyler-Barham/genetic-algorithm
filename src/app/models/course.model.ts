import { Ingredient } from './ingredient.model';
import { CourseIngredient } from './courseIngredient.model';

export class Course {
    name: string = "";
    ingredients: Array<CourseIngredient> = new Array<CourseIngredient>();

    public getIngredients(): Array<CourseIngredient> {
        return this.ingredients;
    }

    public addIngredient(ingredient: Ingredient, quantity: number): void {
        this.ingredients.push(new CourseIngredient(ingredient, quantity));
    }
}