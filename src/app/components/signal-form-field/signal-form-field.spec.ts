import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalFormField } from './signal-form-field';

describe('SignalFormField', () => {
  let component: SignalFormField;
  let fixture: ComponentFixture<SignalFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalFormField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
