import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-excluded-ingredient',
  templateUrl: './excluded-ingredient.component.html',
  styleUrls: ['./excluded-ingredient.component.css']
})
export class ExcludedIngredientComponent implements OnInit {

  @Input()
  ingredient: Ingredient;

  @Output()
  removeIngredient = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  remove(): void {
    this.removeIngredient.emit(this.ingredient);
  }

}
