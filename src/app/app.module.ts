import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { GeneticAlgorithm } from './services/genetic-algorithm.service';

import { AppComponent } from './app.component';
import { CourseComponent } from './components/daily-meal/course/course.component';
import { IngredientComponent } from './components/daily-meal/course/ingredient/ingredient.component';
import { DailyMealComponent } from './components/daily-meal/daily-meal.component';
import { ExcludedIngredientComponent } from './components/excluded-ingredient/excluded-ingredient.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    IngredientComponent,
    DailyMealComponent,
    ExcludedIngredientComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    GeneticAlgorithm
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
