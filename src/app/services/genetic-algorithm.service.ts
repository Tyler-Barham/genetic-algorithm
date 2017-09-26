import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Ingredient } from '../models/ingredient.model';
import { Course, CourseTime } from '../models/course.model';
import { DailyOptions } from '../models/dailyOptions.model';
import { DailyMeal } from '../models/dailyMeal.model';
import { UniqueMeal } from '../models/uniqueMeal.model';
import { WeeklyMeal } from '../models/weeklyMeal.model';
import { CourseIngredient } from '../models/courseIngredient.model';

@Injectable()
export class GeneticAlgorithm {

    private ingredients: Array<Ingredient> = Array<Ingredient>();
    private courses: Array<Course> = Array<Course>();
    private dailyOptions: DailyOptions = new DailyOptions();
    private dailyMeals: Array<DailyMeal> = Array<DailyMeal>();
    private usedWeeklyOptions: Map<Course, number> = new Map<Course, number>();
    private usedDailyOptions: Array<Course> = Array<Course>();
    private uniqueBreakfasts: Array<UniqueMeal> = Array<UniqueMeal>();
    private uniqueLunches: Array<UniqueMeal> = Array<UniqueMeal>();
    private uniqueDinners: Array<UniqueMeal> = Array<UniqueMeal>();

    private populationSize: number = 300;
    private weeklyMealsPopulation: Array<WeeklyMeal> = new Array<WeeklyMeal>();
    private totalFitness: number;

    constructor(public http: Http) {

    }

    public fillInitialPopulation(): void {
        this.weeklyMealsPopulation = new Array<WeeklyMeal>();
        while (this.weeklyMealsPopulation.length < this.populationSize) {
            let anItem = this.generateWeeksMeals();
            this.weeklyMealsPopulation.push(anItem);
        }
    }

    public assignFitness(): void {
        let lastPosition: number = 0;
        this.totalFitness = 0;

        for (let i: number = 0; i < this.weeklyMealsPopulation.length; i++) {
            this.weeklyMealsPopulation[i].rouletStart = lastPosition;
            this.weeklyMealsPopulation[i].fitness = 1 / this.weeklyMealsPopulation[i].price;
            this.weeklyMealsPopulation[i].rouletEnd = this.weeklyMealsPopulation[i].fitness + this.weeklyMealsPopulation[i].rouletStart;
            lastPosition = this.weeklyMealsPopulation[i].rouletEnd;
            this.totalFitness += this.weeklyMealsPopulation[i].fitness;
        };
    }

    public async createChildPopulation(): Promise<void> {
        return new Promise<void>(resolve => {

            let newGeneration: Array<WeeklyMeal> = new Array<WeeklyMeal>();
            this.assignFitness();

            while (newGeneration.length < this.populationSize) {
                let pointer1 = (Math.random() * this.totalFitness);
                let pointer2 = (Math.random() * this.totalFitness);
                let parent1 = this.weeklyMealsPopulation.find(item => (pointer1 >= item.rouletStart && pointer1 < item.rouletEnd));
                let parent2 = this.weeklyMealsPopulation.find(item => (pointer2 >= item.rouletStart && pointer2 < item.rouletEnd));

                if (parent1 == undefined || parent2 == undefined) {
                    console.log("Undefined...");
                    continue;
                }
                if (parent1.rouletStart == parent2.rouletStart && parent1.rouletEnd == parent2.rouletEnd) {
                    continue;
                }

                let child1: WeeklyMeal = new WeeklyMeal();
                let child2: WeeklyMeal = new WeeklyMeal();

                for (let i: number = 0; i < parent1.aDaysMeal.length; i++) {
                    let which: number = Math.random();
                    
                    if (which < 0.5) {
                        child1.aDaysMeal[i] = parent1.aDaysMeal[i];
                    } else {
                        child1.aDaysMeal[i] = parent2.aDaysMeal[i];
                    }

                    which = Math.random();
                    
                    if (which < 0.5) {
                        child2.aDaysMeal[i] = parent1.aDaysMeal[i];
                    } else {
                        child2.aDaysMeal[i] = parent2.aDaysMeal[i];
                    }
                }

                //TODO: check that children are valid according to constraints
                if (this.validateChromosome(child1)) {
                    let price1: number = 0;
                    child1.aDaysMeal.forEach(meal => {
                        price1 += this.calculatePrice(meal.breakfast1.ingredients);
                        price1 += this.calculatePrice(meal.breakfast2.ingredients);
                        price1 += this.calculatePrice(meal.lunch1.ingredients);
                        price1 += this.calculatePrice(meal.lunch2.ingredients);
                        price1 += this.calculatePrice(meal.lunch3.ingredients);
                        price1 += this.calculatePrice(meal.dinner1.ingredients);
                        price1 += this.calculatePrice(meal.dinner2.ingredients);
                        price1 += this.calculatePrice(meal.dinner3.ingredients);
                    });
                    child1.price = price1;
                    newGeneration.push(child1);
                }

                if (this.validateChromosome(child2)) {
                    let price2: number = 0;
                    child2.aDaysMeal.forEach(meal => {
                        price2 += this.calculatePrice(meal.breakfast1.ingredients);
                        price2 += this.calculatePrice(meal.breakfast2.ingredients);
                        price2 += this.calculatePrice(meal.lunch1.ingredients);
                        price2 += this.calculatePrice(meal.lunch2.ingredients);
                        price2 += this.calculatePrice(meal.lunch3.ingredients);
                        price2 += this.calculatePrice(meal.dinner1.ingredients);
                        price2 += this.calculatePrice(meal.dinner2.ingredients);
                        price2 += this.calculatePrice(meal.dinner3.ingredients);
                    });
                    child2.price = price2;
                    newGeneration.push(child2);
                }

            }
            
            this.weeklyMealsPopulation = newGeneration;
            //console.log(newGeneration.slice());
            resolve();
        });
    }

    private validateChromosome(chromosome: WeeklyMeal): boolean {
        let isValid = true;
        this.usedWeeklyOptions = new Map<Course, number>();
//TODO: Add unique meal check
        chromosome.aDaysMeal.forEach(meal => {
            this.usedDailyOptions = new Array<Course>();

            if (this.isReoccuring(meal.breakfast1)) { isValid = false; return; }
            if (this.isReoccuring(meal.breakfast2)) { isValid = false; return; }
            if (this.isReoccuring(meal.lunch1)) { isValid = false; return; }
            if (this.isReoccuring(meal.lunch2)) { isValid = false; return; }
            if (this.isReoccuring(meal.lunch3)) { isValid = false; return; }
            if (this.isReoccuring(meal.dinner1)) { isValid = false; return; }
            if (this.isReoccuring(meal.dinner2)) { isValid = false; return; }
            if (this.isReoccuring(meal.dinner3)) { isValid = false; return; }
            
        });

        return isValid;
    }

    private isReoccuring(course: Course): boolean {

        if (!this.usedDailyOptions.find(dailyCourse => dailyCourse == course)) {
            this.usedDailyOptions.push(course);
        } else {
            return true;
        }
        

        if (this.usedWeeklyOptions.has(course)) {
            let currentCount = this.usedWeeklyOptions.get(course);

            if (currentCount < 3) {
                this.usedWeeklyOptions.set(course, currentCount + 1);
            } else {
                return true;
            }
        } else {
            this.usedWeeklyOptions.set(course, 1);
        }

        return false;
    }

    public findCheapestMeal(): WeeklyMeal {
        let cheapestWeek: WeeklyMeal = new WeeklyMeal();
        cheapestWeek.price = Number.MAX_SAFE_INTEGER;

        this.weeklyMealsPopulation.forEach(weeksMeal => {
            if (weeksMeal.price < cheapestWeek.price) {
                cheapestWeek = weeksMeal;
            }
        });

        return cheapestWeek;
    }

    private generateWeeksMeals(): WeeklyMeal {
        let weeklyMeal: WeeklyMeal = new WeeklyMeal();
        this.usedWeeklyOptions = new Map<Course, number>();
        this.uniqueBreakfasts = new Array<UniqueMeal>();
        this.uniqueLunches = new Array<UniqueMeal>();
        this.uniqueDinners = new Array<UniqueMeal>();

        for (let i: number = 0; i < 7; i++) {
            weeklyMeal.aDaysMeal[i] = this.generateDailyMeal();
        }

        let price: number = 0;

        weeklyMeal.aDaysMeal.forEach(meal => {
            price += this.calculatePrice(meal.breakfast1.ingredients);
            price += this.calculatePrice(meal.breakfast2.ingredients);
            price += this.calculatePrice(meal.lunch1.ingredients);
            price += this.calculatePrice(meal.lunch2.ingredients);
            price += this.calculatePrice(meal.lunch3.ingredients);
            price += this.calculatePrice(meal.dinner1.ingredients);
            price += this.calculatePrice(meal.dinner2.ingredients);
            price += this.calculatePrice(meal.dinner3.ingredients);
          });
          
          weeklyMeal.price = price;

        return weeklyMeal;
    }

    private calculatePrice(array: Array<CourseIngredient>): number {
        let price: number = 0;
        array.forEach(element => {
          price += element.ingredient.price * element.quantity;
        });
        return price;
      }

    private generateDailyMeal(): DailyMeal {
        let aDailyMeal: DailyMeal = new DailyMeal();
        let dailyOptions: DailyOptions = this.dailyOptions;
        let usedMeals: Course = new Course();
        let uniqueMeal: UniqueMeal = new UniqueMeal();
        let isUnique: boolean = false;
        this.usedDailyOptions = new Array<Course>();

        while (!isUnique) {
            aDailyMeal.breakfast1 = this.tryFindMeal(dailyOptions.breakfast1);
            aDailyMeal.breakfast2 = this.tryFindMeal(dailyOptions.breakfast2);
            uniqueMeal = this.storeUniqueMeals(aDailyMeal.breakfast1, aDailyMeal.breakfast2, null);

            if (!this.uniqueBreakfasts.find(meal => (
                meal.course1 == uniqueMeal.course1 &&
                meal.course2 == uniqueMeal.course2 &&
                meal.course3 == uniqueMeal.course3
            ))) {
                isUnique = true;
                this.uniqueBreakfasts.push(uniqueMeal);
            }
        }

        isUnique = false;

        while (!isUnique) {
            aDailyMeal.lunch1 = this.tryFindMeal(dailyOptions.lunch1);
            aDailyMeal.lunch2 = this.tryFindMeal(dailyOptions.lunch2);
            aDailyMeal.lunch3 = this.tryFindMeal(dailyOptions.lunch3);
            uniqueMeal = this.storeUniqueMeals(aDailyMeal.lunch1, aDailyMeal.lunch2, aDailyMeal.lunch3);

            if (!this.uniqueLunches.find(meal => (
                meal.course1 == uniqueMeal.course1 &&
                meal.course2 == uniqueMeal.course2 &&
                meal.course3 == uniqueMeal.course3
            ))) {
                isUnique = true;
                this.uniqueLunches.push(uniqueMeal);
            }
        }

        isUnique = false;

        while (!isUnique) {
            aDailyMeal.dinner1 = this.tryFindMeal(dailyOptions.dinner1);
            aDailyMeal.dinner2 = this.tryFindMeal(dailyOptions.dinner2);
            aDailyMeal.dinner3 = this.tryFindMeal(dailyOptions.dinner3);
            uniqueMeal = this.storeUniqueMeals(aDailyMeal.dinner1, aDailyMeal.dinner2, aDailyMeal.dinner3);

            if (!this.uniqueDinners.find(meal => (
                meal.course1 == uniqueMeal.course1 &&
                meal.course2 == uniqueMeal.course2 &&
                meal.course3 == uniqueMeal.course3
            ))) {
                isUnique = true;
                this.uniqueDinners.push(uniqueMeal);
            }
        }

        return aDailyMeal;
    }

    private storeUniqueMeals(course1: Course, course2: Course, course3: Course): UniqueMeal {
        let aUniqueMeal: UniqueMeal = new UniqueMeal();

        aUniqueMeal.course1 = course1;
        aUniqueMeal.course2 = course2;
        aUniqueMeal.course3 = course3;

        return aUniqueMeal;
    }

    private tryFindMeal(coursesToChooseFrom: Array<Course>): Course {
        let courseToReturn: Course;
        let isValid = false; //Change to false when dataset is large enough
        courseToReturn = this.getRandomFromArray(coursesToChooseFrom);

        while (!isValid) {
            courseToReturn = this.getRandomFromArray(coursesToChooseFrom);

            if (this.usedWeeklyOptions.has(courseToReturn)) {
                if (!this.usedDailyOptions.find(course => (
                    course == courseToReturn
                ))) {
                    if (this.usedWeeklyOptions.get(courseToReturn) < 3) {
                        this.usedWeeklyOptions.set(courseToReturn, this.usedWeeklyOptions.get(courseToReturn) + 1);
                        isValid = true;
                    }
                }
            } else {
                this.usedWeeklyOptions.set(courseToReturn, 1);
                isValid = true;
            }
        }

        this.usedDailyOptions.push(courseToReturn);

        return courseToReturn;
    }

    private getRandomFromArray(array: Array<any>): any {
        return array[Math.floor(Math.random() * array.length)];
    }

    public readTextFiles(): Promise<null> {
        return this.readIngredients().then( () => {
            return this.readCourses().then( () => {
                return this.readCourseRestrictions().then(res => {
                    return null;
                });
            });
        });
    }

    private readIngredients(): Promise<null> {
        return this.http.get('assets/ingredients.txt', null)
        .toPromise()
        .then( res => {
            let lines: string[];
            lines = res.text().split(/(?:\r\n|\r|\n)/g);

            lines.forEach(line => {
                let anIngredient: Ingredient;
                let splitLine: string[] = line.split(', ');
                anIngredient = new Ingredient(splitLine[0], parseFloat(splitLine[1]));
                this.ingredients.push(anIngredient);
            });
            return null;
        });
    }

    private readCourses(): Promise<null> {
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
            return null;
        });
    }

    private readCourseRestrictions(): Promise<null> {
        return this.http.get('assets/restrictions.txt', null)
        .toPromise()
        .then( res => {
            let lines: string[];
            lines = res.text().split(/(?:\r\n|\r|\n)/g)

            lines.forEach(line => {
                let splitLine: string[] = line.split(', ');

                let aCourse: Course = this.courses.find(x => x.name.toLowerCase() == splitLine[0].toLowerCase());

                if (aCourse != null) {

                    if (splitLine[1] == "breakfast") {
                        if (splitLine[2] == "1") {
                            aCourse.courseTime.push(CourseTime.breakfast1);
                            this.dailyOptions.breakfast1.push(aCourse);
                        } else if (splitLine[2] == "2") {
                            aCourse.courseTime.push(CourseTime.breakfast2);
                            this.dailyOptions.breakfast2.push(aCourse);
                        }
                    } else if (splitLine[1] == "lunch") {
                        if (splitLine[2] == "1") {
                            aCourse.courseTime.push(CourseTime.lunch1);
                            this.dailyOptions.lunch1.push(aCourse);
                        } else if (splitLine[2] == "2") {
                            aCourse.courseTime.push(CourseTime.lunch2);
                            this.dailyOptions.lunch2.push(aCourse);
                        } else if (splitLine[2] == "3") {
                            aCourse.courseTime.push(CourseTime.lunch3);
                            this.dailyOptions.lunch3.push(aCourse);
                        }
                    } else if (splitLine[1] == "dinner") {
                        if (splitLine[2] == "1") {
                            aCourse.courseTime.push(CourseTime.dinner1);
                            this.dailyOptions.dinner1.push(aCourse);
                        } else if (splitLine[2] == "2") {
                            aCourse.courseTime.push(CourseTime.dinner2);
                            this.dailyOptions.dinner2.push(aCourse);
                        } else if (splitLine[2] == "3") {
                            aCourse.courseTime.push(CourseTime.dinner3);
                            this.dailyOptions.dinner3.push(aCourse);
                        }
                    }
                }
            });
            return null;
        });
    }

}