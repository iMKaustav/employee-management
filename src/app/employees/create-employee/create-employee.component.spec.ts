import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { CreateEmployeeComponent } from './create-employee.component';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { Employee } from '../../models/employee';
import { MaterialModule } from '../../shared/material/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CreateEmployeeComponent', () => {
  let component: CreateEmployeeComponent;
  let fixture: ComponentFixture<CreateEmployeeComponent>;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeManagementService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateEmployeeComponent>>;

  const mockData = {
    id: '1',
    name: 'name1',
    companyName: 'company1',
    email: 'abc@xyz.com',
    contactNo: '9898981919',
    designation: 'Developer',
    team: 'team1',
    location: 'location1',
    avatarUrl: 'url1'
  };

  beforeEach(async () => {
    const employeeServiceMock = jasmine.createSpyObj('EmployeeManagementService', ['updateEmployee', 'addEmployee']);
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [CreateEmployeeComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: EmployeeManagementService, useValue: employeeServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeComponent);
    component = fixture.componentInstance;
    employeeServiceSpy = TestBed.inject(EmployeeManagementService) as jasmine.SpyObj<EmployeeManagementService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreateEmployeeComponent>>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct controls', () => {
    expect(component.employeeForm).toBeInstanceOf(FormGroup);
    const formControls = component.employeeForm.controls;
    expect(formControls['name'].value).toBe(mockData.name);
    expect(formControls['email'].value).toBe(mockData.email);
    expect(formControls['contactNo'].value).toBe(mockData.contactNo);
    expect(formControls['avatarUrl'].value).toBe(mockData.avatarUrl);
  });

  it('should call updateEmployee on onSubmit when data is present', () => {
    employeeServiceSpy.updateEmployee.and.returnValue(of(mockData));
    component.onSubmit();

    expect(employeeServiceSpy.updateEmployee).toHaveBeenCalledWith(component.employeeForm.value, mockData.id);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call addEmployee on onSubmit when no data is provided', () => {
    component.data = null;
    employeeServiceSpy.addEmployee.and.returnValue(of(mockData));
    component.onSubmit();

    expect(employeeServiceSpy.addEmployee).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should handle updateEmployee error', () => {
    const consoleSpy = spyOn(console, 'error');
    employeeServiceSpy.updateEmployee.and.returnValue(throwError(() => new Error('Error occurred')));

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should handle addEmployee error', () => {
    component.data = null; // No data scenario
    const consoleSpy = spyOn(console, 'error');
    employeeServiceSpy.addEmployee.and.returnValue(throwError(() => new Error('Error occurred')));

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
