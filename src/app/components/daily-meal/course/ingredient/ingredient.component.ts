import { Component, OnInit, Input } from '@angular/core';

import { CourseIngredient } from '../../../../models/courseIngredient.model';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
export class IngredientComponent implements OnInit {

  @Input()
  ingredient: CourseIngredient;

  constructor() { }

  ngOnInit() {
  }

}
