import { DailyMeal } from './dailyMeal.model';

export class WeeklyMeal {
    aDaysMeal: Array<DailyMeal> = new Array<DailyMeal>();
    price: number = 0;
    rouletStart: number;
    rouletEnd: number;
}