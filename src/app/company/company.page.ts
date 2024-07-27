import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from '../shared/services/supabase.service';
import { Router } from '@angular/router';
import { EventService } from '../core/services/event/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: 'company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit, OnDestroy {
  companies: any[] = [];
  private eventSubscription: Subscription;
  private offset = 0;
  private limit = 20;
  private hasMoreCompanies = true;

  constructor(
    private readonly supabase: SupabaseService,
    private eventService: EventService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadCompanies();

    this.eventSubscription = this.eventService.getEvents('loadCompany').subscribe(event => {
      if (event.message) {
        this.resetCompanies();
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  async loadCompanies(event?: any) {
    if (!this.hasMoreCompanies) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    const { data, error } = await this.supabase.listCompanies(this.offset, this.limit);

    if (data) {
      this.companies = this.companies.concat(data);
      this.offset += this.limit;
      this.hasMoreCompanies = data.length === this.limit;
    } else {
      await this.supabase.createNotice(error.message);
    }

    if (event) {
      event.target.complete();
    }
  }

  async resetCompanies() {
    this.offset = 0;
    this.companies = [];
    this.hasMoreCompanies = true;
    await this.loadCompanies();
  }

  async delete(id: number) {
    const { data, error } = await this.supabase.deleteCompany(id);
    if (error) {
      this.supabase.createNotice(error?.message);
      console.error('Error deleting company:', error);
    }

    this.eventService.emitEvent('loadCompany', { message: true });
  }

  addNewCompany() {
    this.router.navigate(['/company/add']);
  }

  loadMore(event: any) {
    this.loadCompanies(event);
  }
}
