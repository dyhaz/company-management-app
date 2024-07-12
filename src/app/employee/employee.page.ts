import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../shared/services/supabase.service';

@Component({
  selector: 'app-employee',
  templateUrl: 'employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {
  employees: any[] = [];
  newEmployee: any = {};
  selectedEmployee: any = null;

  constructor(
    private readonly supabase: SupabaseService,
  ) {}

  ngOnInit() {
    this.getListEmployee();
  }

  async getListEmployee() {
    const loader = await this.supabase.createLoader();
    await loader.present();
    const { data, error } = await this.supabase.listProfiles();
    loader.dismiss();

    if (data) {
      this.employees = data;
    } else {
      await this.supabase.createNotice(error.message);
    }
  }

  async createProfile() {
    const { data, error } = await this.supabase.createProfile(this.newEmployee);
    if (data) {
      this.employees.push(data[0]);
      this.newEmployee = {};
    } else {
      await this.supabase.createNotice(error.message);
      console.error('Error creating profile:', error);
    }
  }

  selectEmployee(employee: any) {
    this.selectedEmployee = { ...employee };
  }

  async deleteProfile(id: number) {
    const { data, error } = await this.supabase.deleteProfile(id);
    if (data) {
      this.getListEmployee();
    } else {
      this.supabase.createNotice(error.message);
      console.error('Error deleting profile:', error);
    }
  }
}
