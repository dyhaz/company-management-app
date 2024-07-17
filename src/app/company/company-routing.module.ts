import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CompanyPage} from './company.page';
import {CompanyFormPage} from "./company-form/company-form.page";

const routes: Routes = [
  {
    path: '',
    component: CompanyPage,
  },
  {
    path: 'add',
    component: CompanyFormPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePageRoutingModule {}
