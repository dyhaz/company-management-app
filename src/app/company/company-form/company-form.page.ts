import {Component, OnInit} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {EventService} from "../../core/services/event/event.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-company-form',
  templateUrl: 'company-form.page.html',
  styleUrls: ['../company.page.scss'],
})
export class CompanyFormPage implements OnInit {
  newCompany: any = {};

  constructor(
    private readonly supabase: SupabaseService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  async createCompany() {
    const { data, error } = await this.supabase.createCompany(this.newCompany);
    if (data) {
      // this.companies.push(data[0]);
      this.newCompany = {};

      this.eventService.emitEvent('loadCompany', { message: true });
      this.router.navigate(['/company'], { replaceUrl: true });
    } else {
      await this.supabase.createNotice(error.message);
      console.error('Error creating company:', error);
    }
  }
}
