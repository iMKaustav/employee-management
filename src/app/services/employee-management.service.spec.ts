import { TestBed } from '@angular/core/testing';

import { EmployeeManagementService } from './employee-management.service';

xdescribe('EmployeeManagementService', () => {
  let service: EmployeeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
