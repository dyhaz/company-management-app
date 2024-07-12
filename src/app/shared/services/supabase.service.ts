import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient, UserResponse,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Profile } from '../entity/entity';
import { SessionService } from '../../core/state/session/session.service';


@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private sessionService: SessionService
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async obtainUser(): Promise<UserResponse | any> {
    return this.supabase.auth.getUser().then((userResponse: UserResponse) => userResponse).catch((error) => {
      console.error('Error fetching user:', error);
      return null;
    });
  }

  async obtainSession(): Promise<Session | any> {
    return this.supabase.auth.getSession().then((session: any) => {
      const { data, error } = session;
      return data ?? error;
    }).catch((error) => {
      console.error('Error fetching session:', error);
      return null;
    });
  }

  async obtainProfile() {
    const user = await this.obtainUser();
    return this.supabase
      .from('employee')
      .select(`
      *
    `)
      .eq('email', user?.email)
      .single();
  }

  async obtainUserDetail() {
    const user = await this.obtainUser();
    return this.supabase
      .from('user')
      .select(`
      *
    `)
      .eq('email', user?.email)
      .single();
  }

  async reauthenticate() {
    const { data, error } = await this.supabase.auth.reauthenticate();

    if (error) {
      console.error('Error reauthenticate:', error);
      return null;
    }

    return { data, error };
  }

  async resetPassword(email: string, password: string = 'Pass1234', nonce?: string) {
    let user;
    if (nonce) {
      user = {
        email,
        password,
        nonce
      };
    } else {
      user = {
        email,
        password
      };
    }
    return this.supabase.auth.updateUser(user);
  }

  async listProfiles() {
    const { data, error } = await this.supabase
      .from('employee')
      .select(`
      *,
      user:user (
        email,
        username
      )
    `);

    if (error) {
      console.error('Error listing profiles:', error);
      return null;
    }

    return { data, error };
  }

  async deleteProfile(id) {
    const { data, error } = await this.supabase
      .from('employee')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting profile:', error);
      return null;
    }

    return { data, error };
  }

  async listCompanies() {
    const { data, error } = await this.supabase
      .from('company')
      .select(`
      *
    `);

    if (error) {
      console.error('Error listing company:', error);
      return null;
    }

    return { data, error };
  }

  async deleteCompany(id) {
    const { data, error } = await this.supabase
      .from('company')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      return null;
    }

    return { data, error };
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signInByPassword(email, password) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    this.sessionService.logout();
    return this.supabase.auth.signOut();
  }

  // Refresh the session, update the auth state
  async refresh() {
    return this.supabase.auth.refreshSession();
  }

  async createProfile(profileData: any) {
    const { data, error } = await this.supabase.from('employee').insert([profileData]).select();
    return { data, error };
  }

  async updateProfile(profile: Profile) {
    let update = {};
    const user = await this.obtainUser();

    // Check existing user
    const existingUser = await this.supabase
      .from('user')
      .select(`
      *
    `)
      .eq('uid', user?.id)
      .single();

    // Check existing employee
    const existingEmployee = await this.supabase
      .from('employee')
      .select(`
      *
    `)
      .eq('email', user?.email)
      .single();

    if (!existingUser?.data?.id) {
      const { data, error } = await this.supabase
        .from('user')
        .upsert({
          uid: user.id,
          email: user.email,
          username: user.email,
          updated_at: new Date(),
          password: 'Pass1234'
        })
        .eq('uid', user.id)
        .select();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      } else if (data) {
        update = {
          ...profile,
          id: existingEmployee?.data?.id,
          email: user.email,
          user_id: data[0].id,
          updated_at: new Date(),
        };
      }
    } else {
      update = {
        ...profile,
        id: existingEmployee?.data?.id,
        email: user?.email,
        user_id: existingUser?.data?.id,
        updated_at: new Date(),
      };
    }

    return this.supabase.from('employee').upsert(update);
  }

  async createCompany(company: any) {
    const { data, error } = await this.supabase.from('company').insert([company]).select();
    return { data, error };
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  async createNotice(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 5000 });
    await toast.present();
  }

  createLoader() {
    return this.loadingCtrl.create();
  }
}
