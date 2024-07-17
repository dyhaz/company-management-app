import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupabaseService} from '../shared/services/supabase.service';
import {Subscription} from 'rxjs';
import {EventService} from '../core/services/event/event.service';

@Component({
  selector: 'app-employee',
  templateUrl: 'employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit, OnDestroy {
  employees: any[] = [];
  selectedEmployee: any = null;
  private eventSubscription: Subscription;

  constructor(
    private readonly supabase: SupabaseService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.getListEmployee();

    this.eventSubscription = this.eventService.getEvents('loadEmployee').subscribe(event => {
      if (event.message) {
        // Reload list employee
        this.getListEmployee();
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
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
