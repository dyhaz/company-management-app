import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../shared/services/supabase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  selectedSegment = 'emailLogin';
  email = '';
  loginIdentifier: string;
  password: string;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  ngOnInit() {
    this.route.fragment.subscribe(async (fragment) => {
      if (fragment) {
        const urlParams = new URLSearchParams(fragment);
        const errorDescription = urlParams.get('error_description');
        if (errorDescription) {
          const errorAlert = await this.alertController.create({
            header: 'Error',
            message: errorDescription,
            buttons: ['OK'],
          });
          await errorAlert.present();
        }
      }
    });
  }

  async handleMagicLink(event: any) {
    event.preventDefault();
    const loader = await this.supabase.createLoader();
    await loader.present();
    try {
      await this.supabase.signIn(this.email);
      await loader.dismiss();
      await this.supabase.createNotice('Check your email for the login link!');
    } catch (error) {
      await loader.dismiss();
      await this.supabase.createNotice(error.error_description || error.message);
    }
  }

  async handleEmailLogin(event: Event) {
    event.preventDefault();
    const loader = await this.supabase.createLoader();
    await loader.present();
    // Implement email/username and password login logic
    const { data, error } = await this.supabase.signInByPassword(this.loginIdentifier, this.password);
    await loader.dismiss();
    if (error) {
      await this.supabase.createNotice(error.message);
      console.error('Login error:', error);
    } else {
      console.log('User logged in:', data?.user);
      this.router.navigate(['/home']);
    }
  }
}
