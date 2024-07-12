import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../shared/services/supabase.service';

@Component({
  selector: 'app-company',
  templateUrl: 'company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  companies: any[] = [];
  newCompany: any = {};

  constructor(
    private readonly supabase: SupabaseService,
  ) {}

  ngOnInit() {
    this.getListCompany();
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

  async createCompany() {
    const { data, error } = await this.supabase.createCompany(this.newCompany);
    if (data) {
      this.companies.push(data[0]);
      this.newCompany = {};
    } else {
      await this.supabase.createNotice(error.message);
      console.error('Error creating company:', error);
    }
  }

  async delete(id: number) {
    const { data, error } = await this.supabase.deleteCompany(id);
    if (data) {
      this.getListCompany();
    } else {
      this.supabase.createNotice(error.message);
      console.error('Error deleting company:', error);
    }
  }
}
