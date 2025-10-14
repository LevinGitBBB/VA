import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Reader } from './reader';

describe('Reader', () => {
  let component: Reader;
  let fixture: ComponentFixture<Reader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Reader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
