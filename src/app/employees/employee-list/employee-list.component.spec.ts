import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { Employee } from '../../models/employee';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeManagementService>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockEmployeeService = jasmine.createSpyObj('EmployeeManagementService', ['getEmployees', 'deleteEmployee']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: EmployeeManagementService, useValue: mockEmployeeService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadEmployees', () => {
      spyOn(component, 'loadEmployees');
      component.ngOnInit();
      expect(component.loadEmployees).toHaveBeenCalled();
    });
  });

  describe('toggleMenu', () => {
    it('should toggle isExpanded', () => {
      component.isExpanded = true;
      component.toggleMenu();
      expect(component.isExpanded).toBeFalse();
      component.toggleMenu();
      expect(component.isExpanded).toBeTrue();
    });
  });

  describe('toggleSearchBox', () => {
    it('should toggle isSearchEnabled and disable isFilterEnabled', () => {
      component.isSearchEnabled = false;
      component.isFilterEnabled = true;
      component.toggleSearchBox();
      expect(component.isSearchEnabled).toBeTrue();
      expect(component.isFilterEnabled).toBeFalse();
    });
  });

  describe('toggleFilterBox', () => {
    it('should toggle isFilterEnabled and disable isSearchEnabled', () => {
      component.isFilterEnabled = false;
      component.isSearchEnabled = true;
      component.toggleFilterBox();
      expect(component.isFilterEnabled).toBeTrue();
      expect(component.isSearchEnabled).toBeFalse();
    });
  });

  describe('loadEmployees', () => {
    it('should load employees', () => {
      const mockEmployees: Employee[] = [
        {
          id: '1',
          name: 'name1',
          companyName: 'company1',
          email: 'abc@xyz.com',
          contactNo: '9898981919',
          designation: 'Developer',
          team: 'team1',
          location: 'location1',
          avatarUrl: 'url1'
        }
      ];
      mockEmployeeService.getEmployees.and.returnValue(of(mockEmployees));

      component.loadEmployees();

      expect(mockEmployeeService.getEmployees).toHaveBeenCalledWith('', {});
      expect(component.employees).toEqual(mockEmployees);
      expect(component.filteredEmployees).toEqual(mockEmployees);
    });
  });

  describe('openAddEditEmployeeDialog', () => {
    it('should open the dialog and reload employees after closing', () => {
      const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
      mockDialog.open.and.returnValue(dialogRefSpy);
      spyOn(component, 'loadEmployees');

      component.openAddEditEmployeeDialog();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
      expect(component.loadEmployees).toHaveBeenCalled();
    });
  });

  describe('confirmDeleteEmployee', () => {
    it('should open delete confirmation dialog and call deleteEmployee if confirmed', () => {
      const employeeId = '1';
      const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
      mockDialog.open.and.returnValue(dialogRefSpy);
      spyOn(component, 'deleteEmployee');

      component.confirmDeleteEmployee(employeeId);

      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.anything(), {
        width: '330px',
        data: { id: employeeId }
      });
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
      expect(component.deleteEmployee).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('deleteEmployee', () => {
    it('should call deleteEmployee and reload employees', () => {
      const employeeId = '1';
      mockEmployeeService.deleteEmployee.and.returnValue(of());
      spyOn(component, 'loadEmployees');

      component.deleteEmployee(employeeId);

      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('onSearch', () => {
    it('should filter employees based on search text', () => {
      component.employees = [
        {
          id: '1',
          name: 'name1',
          companyName: 'company1',
          email: 'abc@xyz.com',
          contactNo: '9898981919',
          designation: 'Developer',
          team: 'team1',
          location: 'location1',
          avatarUrl: 'url1'
        }
      ];
      component.searchText = 'name1';
      component.onSearch();

      expect(component.employees.length).toBe(1);
      expect(component.employees[0].name).toBe('name1');
    });
  });

  describe('clearSearch', () => {
    it('should clear search text and reload employees', () => {
      spyOn(component, 'loadEmployees');

      component.searchText = 'test';
      component.clearSearch();

      expect(component.searchText).toBe('');
      expect(component.loadEmployees).toHaveBeenCalled();
    });
  });

  describe('clearFilter', () => {
    it('should clear filters and reload employees', () => {
      spyOn(component, 'loadEmployees');

      component.filters = { location: 'Bangalore' };
      component.clearFilter();

      expect(component.filters).toEqual({});
      expect(component.loadEmployees).toHaveBeenCalled();
    });
  });

  describe('onCheckboxChange', () => {
    it('should update filters and reload employees when checked', () => {
      const event = { checked: true } as MatCheckboxChange;
      spyOn(component, 'loadEmployees');

      component.onCheckboxChange(event);

      expect(component.filters).toEqual({ location: 'Bangalore' });
      expect(component.loadEmployees).toHaveBeenCalled();
    });

    it('should clear filters and reload employees when unchecked', () => {
      const event = { checked: false } as MatCheckboxChange;
      spyOn(component, 'loadEmployees');

      component.onCheckboxChange(event);

      expect(component.filters).toEqual({});
      expect(component.loadEmployees).toHaveBeenCalled();
    });
  });
});
