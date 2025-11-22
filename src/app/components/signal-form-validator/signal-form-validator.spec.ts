import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalFormValidator } from './signal-form-validator';

describe('SignalFormValidator', () => {
  let component: SignalFormValidator;
  let fixture: ComponentFixture<SignalFormValidator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormValidator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalFormValidator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
