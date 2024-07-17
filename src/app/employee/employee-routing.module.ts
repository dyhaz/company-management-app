import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EmployeePage} from './employee.page';
import {EmployeeFormPage} from './employee-form/employee-form.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeePage,
  },
  {
    path: 'add',
    component: EmployeeFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePageRoutingModule {}
