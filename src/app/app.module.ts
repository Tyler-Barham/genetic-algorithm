import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { GeneticAlgorithm } from './services/genetic-algorithm.service';

import { AppComponent } from './app.component';
import { CourseComponent } from './components/daily-meal/course/course.component';
import { IngredientComponent } from './components/daily-meal/course/ingredient/ingredient.component';
import { DailyMealComponent } from './components/daily-meal/daily-meal.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    IngredientComponent,
    DailyMealComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    GeneticAlgorithm
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
