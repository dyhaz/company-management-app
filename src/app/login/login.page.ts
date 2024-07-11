import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../shared/services/supabase.service';
import {Router} from '@angular/router';

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
    private router: Router
  ) {}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  ngOnInit() {}

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
    const { user, error } = await this.supabase.signInByPassword(this.loginIdentifier, this.password);
    await loader.dismiss();
    if (error) {
      await this.supabase.createNotice(error.message);
      console.error('Login error:', error);
    } else {
      console.log('User logged in:', user);
      this.router.navigate(['/home']);
    }
  }
}
