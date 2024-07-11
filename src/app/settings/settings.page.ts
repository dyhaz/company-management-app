import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {SupabaseService} from "../shared/services/supabase.service";

@Component({
  selector: 'app-login',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
  }

  async resetPassword() {
    const email = this.supabaseService.user.email;

    const alert = await this.alertController.create({
      header: 'Confirm Password Reset',
      message: `Are you sure you want to reset the password for ${email}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: async () => {
            const { error, data } = await this.supabaseService.resetPassword(email);
            if (error) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: error.message,
                buttons: ['OK'],
              });
              await errorAlert.present();
            } else {
              const successAlert = await this.alertController.create({
                header: 'Success',
                message: 'Password reset link has been sent to your email.',
                buttons: ['OK'],
              });
              await successAlert.present();
              this.navCtrl.navigateRoot('/settings');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  navigateTo(path: string) {
    this.navCtrl.navigateRoot(path);
  }
}
