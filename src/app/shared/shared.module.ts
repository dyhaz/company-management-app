import {AppStickyHeaderComponent} from './components/header/app-sticky-header.component';
import {AppStickyFooterMenuComponent} from './components/footer/app-sticky-footer.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    AppStickyFooterMenuComponent,
    AppStickyHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    AppStickyFooterMenuComponent,
    AppStickyHeaderComponent
  ],
})
export class SharedModule {}
