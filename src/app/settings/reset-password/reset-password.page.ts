import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { SupabaseService } from '../../shared/services/supabase.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: [],
})
export class ResetPasswordPage {
  newPassword = '';
  confirmPassword = '';

  constructor(
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async resetPassword(event: Event) {
    event.preventDefault();

    console.log(this.newPassword);
    if (this.newPassword !== this.confirmPassword) {
      // Add logic to handle password mismatch
      return;
    }

    await this.updatePassword();
  }

  async updatePassword() {
    const user = await this.supabaseService.obtainUser();
    const email = user.email;

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
            await this.reauthenticate();
            const { error, data } = await this.supabaseService.resetPassword(email, this.confirmPassword);
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

  async reauthenticate() {
    const { error, data } = await this.supabaseService.reauthenticate();

    console.log(error);
    console.log(data);
  }
}
