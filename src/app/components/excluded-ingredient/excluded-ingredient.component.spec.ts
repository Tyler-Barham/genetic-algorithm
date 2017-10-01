import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludedIngredientComponent } from './excluded-ingredient.component';

describe('ExcludedIngredientComponent', () => {
  let component: ExcludedIngredientComponent;
  let fixture: ComponentFixture<ExcludedIngredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcludedIngredientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludedIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
