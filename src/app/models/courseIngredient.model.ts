import { Ingredient } from './ingredient.model';

export class CourseIngredient {
    ingredient: Ingredient = new Ingredient();
    quantity: number = 0;

    constructor(ingredient: Ingredient, quantity: number) {
        this.ingredient = ingredient;
        this.quantity = quantity;
    }
}