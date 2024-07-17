import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../../shared/services/supabase.service';
import {EventService} from '../../core/services/event/event.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: 'employee-form.page.html',
  styleUrls: ['../employee.page.scss'],
})
export class EmployeeFormPage implements OnInit {
  newEmployee: any = {};
  selectedEmployee: any = null;

  constructor(
    private readonly supabase: SupabaseService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
  }

  async createProfile() {
    const { data, error } = await this.supabase.createProfile(this.newEmployee);
    if (data) {
      // this.employees.push(data[0]);
      this.newEmployee = {};
    } else {
      await this.supabase.createNotice(error.message);
      console.error('Error creating profile:', error);
    }

    this.eventService.emitEvent('loadEmployee', { message: true });
  }

  selectEmployee(employee: any) {
    this.selectedEmployee = { ...employee };
  }
}
