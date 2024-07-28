import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from '../shared/services/supabase.service';
import { Subscription } from 'rxjs';
import { EventService } from '../core/services/event/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: 'employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit, OnDestroy {
  employees: any[] = [];
  selectedEmployee: any = null;
  private eventSubscription: Subscription;
  private offset = 0;
  private limit = 20;
  private hasMoreEmployees = true;

  constructor(
    private readonly supabase: SupabaseService,
    private eventService: EventService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadEmployees();

    this.eventSubscription = this.eventService.getEvents('loadEmployee').subscribe(event => {
      if (event.message) {
        this.resetEmployees();
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  async loadEmployees(event?: any) {
    if (!this.hasMoreEmployees) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    const { data, error } = await this.supabase.listProfiles(this.offset, this.limit);

    if (data) {
      this.employees = this.employees.concat(data);
      this.offset += this.limit;
      this.hasMoreEmployees = data.length === this.limit;
    } else {
      await this.supabase.createNotice(error.message);
    }

    if (event) {
      event.target.complete();
    }
  }

  async resetEmployees() {
    this.offset = 0;
    this.employees = [];
    this.hasMoreEmployees = true;
    await this.loadEmployees();
  }

  selectEmployee(employee: any) {
    this.selectedEmployee = { ...employee };
  }

  async deleteProfile(id: number) {
    const { data, error } = await this.supabase.deleteProfile(id);
    if (error) {
      this.supabase.createNotice(error?.message);
      console.error('Error deleting profile:', error);
    }

    this.eventService.emitEvent('loadEmployee', { message: true });
  }

  addNewEmployee() {
    this.router.navigate(['/employee/add']);
  }

  loadMore(event: any) {
    this.loadEmployees(event);
  }
}
