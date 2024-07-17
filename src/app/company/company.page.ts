import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupabaseService} from '../shared/services/supabase.service';
import {Router} from '@angular/router';
import {EventService} from '../core/services/event/event.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: 'company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit, OnDestroy {
  companies: any[] = [];
  private eventSubscription: Subscription;

  constructor(
    private readonly supabase: SupabaseService,
    private eventService: EventService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getListCompany();

    this.eventSubscription = this.eventService.getEvents('loadCompany').subscribe(event => {
      if (event.message) {
        // Reload list employee
        this.getListCompany();
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  async getListCompany() {
    const loader = await this.supabase.createLoader();
    await loader.present();
    const { data, error } = await this.supabase.listCompanies();
    loader.dismiss();

    if (data) {
      this.companies = data;
    } else {
      await this.supabase.createNotice(error.message);
    }
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
}
