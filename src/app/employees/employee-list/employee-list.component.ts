import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { Employee } from '../../models/employee';
import { EmployeeFilter } from '../../models/employee-filter';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
import { DESIGNATIONS, TEAMS, LOCATIONS } from '../../shared/constants/employee-data';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  readonly designations = DESIGNATIONS;
  readonly teams = TEAMS;
  readonly locations = LOCATIONS;
  isExpanded = true;
  isFilterEnabled = false;
  isSearchEnabled = false;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText: string = '';
  filters: EmployeeFilter = {};

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeManagementService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleSearchBox(): void {
    this.isSearchEnabled = !this.isSearchEnabled;
    this.isFilterEnabled = false;
  }

  toggleFilterBox(): void {
    this.isFilterEnabled = !this.isFilterEnabled;
    this.isSearchEnabled = false;
  }

  openAddEditEmployeeDialog(): void {
    const dialogRef = this.dialog.open(CreateEmployeeComponent);

    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.loadEmployees();
        }
      }
    });
  }

  confirmDeleteEmployee(employeeId: string): void {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      width: '330px',
      data: { id: employeeId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteEmployee(employeeId);
      }
    });
  }

  deleteEmployee(employeeId: string): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.loadEmployees();
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.loadEmployees();
        }
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.searchText, this.filters)
      .subscribe((data: Employee[]) => {
        this.employees = data;
        this.filteredEmployees = data;
      });
  }

  onSearch(): void {
    const searchLower = this.searchText.toLowerCase();
    this.employees = this.employees.filter((employee: Employee) =>
      employee.name.toLowerCase().includes(searchLower) || employee.email.toLowerCase().includes(searchLower)
    );
  }

  clearSearch(): void {
    this.searchText = '';
    this.loadEmployees();
  }

  clearFilter(): void {
    this.filters = {};
    this.loadEmployees();
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    this.filters = event.checked ? { location: "Bangalore" } : {};
    this.loadEmployees();
  }
}
