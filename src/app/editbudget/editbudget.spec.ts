import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editbudget } from './editbudget';

describe('Editbudget', () => {
  let component: Editbudget;
  let fixture: ComponentFixture<Editbudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editbudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editbudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
