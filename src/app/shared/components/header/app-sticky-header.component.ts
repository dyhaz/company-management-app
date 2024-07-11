import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SupabaseService} from '../../../supabase.service';

@Component({
  selector: 'app-sticky-header',
  templateUrl: './app-sticky-header.component.html',
  styleUrls: ['./app-sticky-header.component.scss'],
})
export class AppStickyHeaderComponent implements OnInit {
  username = 'unknown';

  avatar: any = null;

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    // Assume you have a service to get the logged-in user's details
    // You would inject the service and use it to set the username
    this.username = this.supabase.user.id; // Replace with actual username
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
