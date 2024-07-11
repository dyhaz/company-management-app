import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';
import { Profile } from '../shared/entity/entity';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  profile: Profile = {
    first_name: '',
    last_name: '',
    avatar_url: '',
    position: '',
    department: '',
  };

  session = this.supabase.session;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    const loader = await this.supabase.createLoader();
    await loader.present();
    try {
      let { data: profile, error, status } = await this.supabase.profile;
      if (error && status !== 406) {
        throw error;
      }
      if (profile) {
        this.profile = profile;
      }
      await loader.dismiss();
    } catch (error) {
      await loader.dismiss();
      await this.supabase.createNotice(error.message);
    }
  }

  async updateProfile(avatar_url: string = '') {
    const loader = await this.supabase.createLoader();
    await loader.present();
    try {
      await this.supabase.updateProfile({ ...this.profile, avatar_url });
      await loader.dismiss();
      await this.supabase.createNotice('Profile updated!');
    } catch (error) {
      await loader.dismiss();
      await this.supabase.createNotice(error.message);
    }

    this.supabase.refresh();
    this.router.navigate(['/home']);
  }

  async signOut() {
    console.log('testing?');
    await this.supabase.signOut();
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
