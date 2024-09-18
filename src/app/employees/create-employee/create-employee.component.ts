import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EmployeeManagementService } from '../../services/employee-management.service';
import { DESIGNATIONS, TEAMS, LOCATIONS, AVATARS } from '../../shared/constants/employee-data';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent {
  readonly designations = DESIGNATIONS;
  readonly teams = TEAMS;
  readonly locations = LOCATIONS;
  readonly avatars = AVATARS;
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeManagementService,
    private dialogRef: MatDialogRef<CreateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      designation: ['', [Validators.required]],
      team: ['', [Validators.required]],
      location: ['', [Validators.required]],
      avatarUrl: [this.avatars[0], [Validators.required]]
    });
  }

  get name(): FormControl {
    return this.employeeForm?.get('name') as FormControl;
  }

  get companyName(): FormControl {
    return this.employeeForm?.get('companyName') as FormControl;
  }

  get email(): FormControl {
    return this.employeeForm?.get('email') as FormControl;
  }

  get contactNo(): FormControl {
    return this.employeeForm?.get('contactNo') as FormControl;
  }

  get designation(): FormControl {
    return this.employeeForm?.get('designation') as FormControl;
  }

  get team(): FormControl {
    return this.employeeForm?.get('team') as FormControl;
  }

  get location(): FormControl {
    return this.employeeForm?.get('location') as FormControl;
  }

  ngOnInit(): void {
    this.employeeForm.patchValue(this.data);
  }

  onSubmit(): void {
    if (this.data) {
      this.employeeService.updateEmployee(this.employeeForm.value, this.data.id).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    } else {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe({
        next: (val: any) => {
          this.employeeForm.reset();
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }
}
