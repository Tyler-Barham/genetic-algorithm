import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMealComponent } from './daily-meal.component';

describe('DailyMealComponent', () => {
  let component: DailyMealComponent;
  let fixture: ComponentFixture<DailyMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
