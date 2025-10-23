import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ausgaben } from './ausgaben';

describe('Ausgaben', () => {
  let component: Ausgaben;
  let fixture: ComponentFixture<Ausgaben>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Ausgaben]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ausgaben);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
