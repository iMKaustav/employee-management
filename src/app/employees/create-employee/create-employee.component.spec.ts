import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CreateEmployeeComponent } from './create-employee.component';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { Employee } from '../../models/employee';
import { MaterialModule } from '../../shared/material/material.module';

xdescribe('CreateEmployeeComponent', () => {
  let component: CreateEmployeeComponent;
  let fixture: ComponentFixture<CreateEmployeeComponent>;
  let employeeService: jasmine.SpyObj<EmployeeManagementService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CreateEmployeeComponent>>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeManagementService', ['addEmployee', 'updateEmployee']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [CreateEmployeeComponent],
      providers: [
        FormBuilder,
        { provide: EmployeeManagementService, useValue: employeeServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    employeeService = TestBed.inject(EmployeeManagementService) as jasmine.SpyObj<EmployeeManagementService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreateEmployeeComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.employeeForm).toBeDefined();
    expect(component.employeeForm.get('name')).toBeTruthy();
    expect(component.employeeForm.get('companyName')).toBeTruthy();
    expect(component.employeeForm.get('email')).toBeTruthy();
    expect(component.employeeForm.get('contactNo')).toBeTruthy();
    expect(component.employeeForm.get('designation')).toBeTruthy();
    expect(component.employeeForm.get('team')).toBeTruthy();
    expect(component.employeeForm.get('location')).toBeTruthy();
    expect(component.employeeForm.get('avatarUrl')).toBeTruthy();
  });

  it('should patch form values on ngOnInit', () => {
    const data = {
      name: 'John Doe',
      companyName: 'Acme Corp',
      email: 'john.doe@example.com',
      contactNo: '1234567890',
      designation: 'Developer',
      team: 'Engineering',
      location: 'Headquarters',
      avatarUrl: 'avatar.png'
    };

    component.data = data;
    component.ngOnInit();

    expect(component.employeeForm.value).toEqual(data);
  });

  it('should call addEmployee and reset form on successful submission', () => {
    employeeService.addEmployee.and.returnValue(of({
      id: 'abc1'
    } as Employee));
    component.employeeForm.setValue({
      name: 'Jane Doe',
      companyName: 'Tech Co',
      email: 'jane.doe@example.com',
      contactNo: '0987654321',
      designation: 'Manager',
      team: 'Sales',
      location: 'Branch Office',
      avatarUrl: 'avatar2.png'
    });

    component.onSubmit();

    expect(employeeService.addEmployee).toHaveBeenCalledWith(component.employeeForm.value);
    expect(component.employeeForm.pristine).toBeTrue();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call updateEmployee and close dialog on successful update', () => {
    const data = { id: '12345' };
    component.data = data;
    employeeService.updateEmployee.and.returnValue(of({
      id: 'abc1'
    } as Employee));

    component.employeeForm.setValue({
      name: 'Jane Doe',
      companyName: 'Tech Co',
      email: 'jane.doe@example.com',
      contactNo: '0987654321',
      designation: 'Manager',
      team: 'Sales',
      location: 'Branch Office',
      avatarUrl: 'avatar2.png'
    });

    component.onSubmit();

    expect(employeeService.updateEmployee).toHaveBeenCalledWith(component.employeeForm.value, data.id);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should handle errors when adding employee', () => {
    employeeService.addEmployee.and.returnValue(throwError(() => new Error('Error')));
    component.employeeForm.setValue({
      name: 'Jane Doe',
      companyName: 'Tech Co',
      email: 'jane.doe@example.com',
      contactNo: '0987654321',
      designation: 'Manager',
      team: 'Sales',
      location: 'Branch Office',
      avatarUrl: 'avatar2.png'
    });

    spyOn(console, 'error');
    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
  });
});
