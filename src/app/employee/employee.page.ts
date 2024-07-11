import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../supabase.service';

@Component({
  selector: 'app-employee',
  templateUrl: 'employee.page.html',
  styleUrls: [],
})
export class EmployeePage implements OnInit {
  employees: any[] = [];
  newEmployee: any = {};
  selectedEmployee: any = null;

  constructor(
    private supabaseService: SupabaseService,
  ) {}

  ngOnInit() {
    this.getListEmployee();
  }

  async getListEmployee() {
    const { data, error } = await this.supabaseService.listProfiles();

    if (data) {
      this.employees = data;
    } else {
      alert(error.message);
    }
  }

  async createProfile() {
    const { data, error } = await this.supabaseService.createProfile(this.newEmployee);
    if (data) {
      this.employees.push(data[0]);
      this.newEmployee = {};
    } else {
      alert(error.message);
      console.error('Error creating profile:', error);
    }
  }

  selectEmployee(employee: any) {
    this.selectedEmployee = { ...employee };
  }

  async deleteProfile(userId: number) {
    const { data, error } = await this.supabaseService.deleteProfile(userId);
    if (data) {
      this.getListEmployee();
    } else {
      console.error('Error deleting profile:', error);
    }
  }
}
