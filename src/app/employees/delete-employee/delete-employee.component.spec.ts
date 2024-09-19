import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DeleteEmployeeComponent } from './delete-employee.component';

describe('DeleteEmployeeComponent', () => {
  let component: DeleteEmployeeComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeleteEmployeeComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [DeleteEmployeeComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(DeleteEmployeeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog without a result when onNoClick is called', () => {
    component.onNoClick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should close the dialog with a true result when onConfirm is called', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
