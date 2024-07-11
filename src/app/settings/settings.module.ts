import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {SettingsRoutingModule} from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsRoutingModule
  ],
  declarations: [SettingsPage, ResetPasswordPage]
})
export class SettingsModule {}
