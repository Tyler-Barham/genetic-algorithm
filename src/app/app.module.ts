import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { GeneticAlgorithm } from './services/genetic-algorithm.service';

import { AppComponent } from './app.component';
import { CourseComponent } from './components/course/course.component';
import { IngredientComponent } from './components/course/ingredient/ingredient.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    IngredientComponent
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
