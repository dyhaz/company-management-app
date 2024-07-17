import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {EmployeePage} from './employee.page';
import {EmployeePageRoutingModule} from './employee-routing.module';
import {EmployeeFormPage} from './employee-form/employee-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeePageRoutingModule
  ],
  declarations: [EmployeePage, EmployeeFormPage]
})
export class EmployeePageModule {}
