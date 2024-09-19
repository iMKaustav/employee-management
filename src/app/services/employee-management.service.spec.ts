import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { EmployeeManagementService } from './employee-management.service';
import { Employee } from '../models/employee';
import { EmployeeFilter } from '../models/employee-filter';

describe('EmployeeManagementService', () => {
  let service: EmployeeManagementService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const mockApiUrl = 'mockApiUrl';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        EmployeeManagementService,
        { provide: HttpClient, useValue: spy }
      ]
    });

    service = TestBed.inject(EmployeeManagementService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    (service as any).apiUrl = mockApiUrl;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get employees (with optional search and filter)', () => {
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
      },
      {
        id: '2',
        name: 'name2',
        companyName: 'company2',
        email: 'abc@xyz.com',
        contactNo: '9898981919',
        designation: 'Developer',
        team: 'team2',
        location: 'location2',
        avatarUrl: 'url2'
      }
    ];

    httpClientSpy.get.and.returnValue(of(mockEmployees));

    service.getEmployees('name1', { designation: 'Developer' }).subscribe((employees: Employee[]) => {
      expect(employees).toEqual(mockEmployees);
    });

    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(
      `${mockApiUrl}`,
      { params: jasmine.any(Object) }
    );
  });

  it('should add an employee', () => {
    const newEmployee: Employee = {
      id: '3',
      name: 'name3',
      companyName: 'company3',
      email: 'abc@xyz.com',
      contactNo: '9898981919',
      designation: 'Developer',
      team: 'team1',
      location: 'location1',
      avatarUrl: 'url1'
    };

    httpClientSpy.post.and.returnValue(of(newEmployee));

    service.addEmployee(newEmployee).subscribe((employee: Employee) => {
      expect(employee).toEqual(newEmployee);
    });

    expect(httpClientSpy.post).toHaveBeenCalledOnceWith(
      `${mockApiUrl}`, // Ensure the right URL was used
      newEmployee
    );
  });

  it('should update an employee', () => {
    const updatedEmployee: Employee = {
      id: '3',
      name: 'name3',
      companyName: 'company3',
      email: 'abc@xyz.com',
      contactNo: '9898981919',
      designation: 'HR',
      team: 'team1',
      location: 'location1',
      avatarUrl: 'url1'
    };

    httpClientSpy.put.and.returnValue(of(updatedEmployee));

    service.updateEmployee(updatedEmployee, '3').subscribe((employee: Employee) => {
      expect(employee).toEqual(updatedEmployee);
    });

    expect(httpClientSpy.put).toHaveBeenCalledOnceWith(
      `${mockApiUrl}/3`,
      updatedEmployee
    );
  });

  it('should delete an employee', () => {
    httpClientSpy.delete.and.returnValue(of(undefined));

    service.deleteEmployee('1').subscribe((response: any) => {
      expect(response).toBeUndefined();
    });

    expect(httpClientSpy.delete).toHaveBeenCalledOnceWith(
      `${mockApiUrl}/1`
    );
  });
});
