import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../models/employee';
import { EmployeeFilter } from '../models/employee-filter';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {
  private apiUrl = 'https://infrrd-employee-management-721bd7b0b18e.herokuapp.com/employees';

  constructor(private http: HttpClient) { }

  getEmployees(search?: string, filter: EmployeeFilter = {}): Observable<Employee[]> {
    let params = new HttpParams();

    if (search) {
      params = params.set('name', search);
    }

    Object.keys(filter).forEach(key => {
      if (filter[key as keyof EmployeeFilter]) {
        params = params.set(key, filter[key as keyof EmployeeFilter]!);
      }
    });

    return this.http.get<Employee[]>(this.apiUrl, { params });
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(employee: Employee, id: string): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
