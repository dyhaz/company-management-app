import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
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

  get user() {
    return this.supabase.auth.user();
  }

  get session() {
    return this.supabase.auth.session();
  }

  get profile() {
    return this.supabase
      .from('employee')
      .select(`
      *
    `)
      .eq('email', this.user?.email)
      .single();
  }

  get userDetail() {
    return this.supabase
      .from('user')
      .select(`
      *
    `)
      .eq('email', this.user?.email)
      .single();
  }

  async resetPassword(email: string, password: string = 'Pass1234') {
    return this.supabase.auth.update({
      email,
      password
    });
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

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email });
  }

  signInByPassword(email, password) {
    return this.supabase.auth.signIn({ email, password });
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
    const { data, error } = await this.supabase.from('employee').insert([profileData]);
    return { data, error };
  }

  async updateProfile(profile: Profile) {
    let update = {};

    // Check existing user
    const existingUser = await this.supabase
      .from('user')
      .select(`
      *
    `)
      .eq('uid', this.user?.id)
      .single();

    // Check existing employee
    const existingEmployee = await this.supabase
      .from('employee')
      .select(`
      *
    `)
      .eq('email', this.user?.email)
      .single();

    if (!existingUser?.data?.id) {
      const { data, error } = await this.supabase
        .from('user')
        .upsert({
          uid: this.user.id,
          email: this.user.email,
          username: this.user.email,
          updated_at: new Date(),
          password: 'Pass1234'
        })
        .eq('uid', this.user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      update = {
        ...profile,
        id: existingEmployee?.data?.id,
        email: this.user.email,
        user_id: data[0].id,
        updated_at: new Date(),
      };
    } else {
      update = {
        ...profile,
        id: existingEmployee?.data?.id,
        email: this.user.email,
        user_id: existingUser?.data?.id,
        updated_at: new Date(),
      };
    }

    return this.supabase.from('employee').upsert(update, {
      returning: 'minimal', // Don't return the value after inserting
    });
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
