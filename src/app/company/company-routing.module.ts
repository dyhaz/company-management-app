import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CompanyPage} from './company.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePageRoutingModule {}
