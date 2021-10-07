import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOneStringComponent } from './dialog-one-string.component';

describe('DialogOneStringComponent', () => {
  let component: DialogOneStringComponent;
  let fixture: ComponentFixture<DialogOneStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOneStringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOneStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
