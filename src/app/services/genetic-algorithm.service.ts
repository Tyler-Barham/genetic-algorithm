import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Ingredient } from '../models/ingredient.model';
import { Course, CourseTime } from '../models/course.model';
import { DailyOptions } from '../models/dailyOptions.model';
import { DailyMeal } from '../models/dailyMeal.model';
import { UniqueMeal } from '../models/uniqueMeal.model'

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

    constructor(public http: Http) {

    }

    public generateWeeklyMeals(): Array<DailyMeal> {
        let weeklyMeals: Array<DailyMeal> = new Array<DailyMeal>();
        this.usedWeeklyOptions = new Map<Course, number>();
        this.uniqueBreakfasts = new Array<UniqueMeal>();
        this.uniqueLunches = new Array<UniqueMeal>();
        this.uniqueDinners = new Array<UniqueMeal>();

        weeklyMeals.push(this.generateDailyMeal());
        weeklyMeals.push(this.generateDailyMeal());
        weeklyMeals.push(this.generateDailyMeal());
        weeklyMeals.push(this.generateDailyMeal());
        weeklyMeals.push(this.generateDailyMeal());
        weeklyMeals.push(this.generateDailyMeal());
        weeklyMeals.push(this.generateDailyMeal());

        return weeklyMeals;
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
            aDailyMeal.dinner1 = this.tryFindMeal(dailyOptions.dinner1);
            aDailyMeal.dinner2 = this.tryFindMeal(dailyOptions.dinner2);
            aDailyMeal.dinner3 = this.tryFindMeal(dailyOptions.dinner3);
            uniqueMeal = this.storeUniqueMeals(aDailyMeal.dinner1, aDailyMeal.dinner2, aDailyMeal.dinner3);

            if (!this.uniqueBreakfasts.find(meal => (
                meal.course1 == uniqueMeal.course1 &&
                meal.course2 == uniqueMeal.course2 &&
                meal.course3 == uniqueMeal.course3
            ))) {
                isUnique = true;
                this.uniqueBreakfasts.push(uniqueMeal);
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
        let isValid = true; //Change to false when dataset is large enough
        courseToReturn = this.getRandomFromArray(coursesToChooseFrom);

        while (!isValid) {
            courseToReturn = this.getRandomFromArray(coursesToChooseFrom);

            if (this.usedWeeklyOptions.has(courseToReturn)) {
                if (!this.usedDailyOptions.find(course => (
                    course == courseToReturn
                    //TODO: check this is accurate
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

            console.log(isValid);
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