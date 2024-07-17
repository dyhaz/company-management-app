import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {CompanyPage} from './company.page';
import {EmployeePageRoutingModule} from './company-routing.module';
import {CompanyFormPage} from './company-form/company-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeePageRoutingModule
  ],
  declarations: [CompanyPage, CompanyFormPage]
})
export class CompanyModule {}
