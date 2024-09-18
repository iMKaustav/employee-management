import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { MaterialModule } from '../shared/material/material.module';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { DeleteEmployeeComponent } from './delete-employee/delete-employee.component';


@NgModule({
  declarations: [
    EmployeeListComponent,
    CreateEmployeeComponent,
    DeleteEmployeeComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployeesModule { }
