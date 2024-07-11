import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SupabaseService} from '../../services/supabase.service';
import {SessionService} from "../../../core/state/session/session.service";
import {DomSanitizer} from "@angular/platform-browser";

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
    private supabase: SupabaseService,
    private sessionService: SessionService,
    private readonly dom: DomSanitizer
  ) {}

  ngOnInit() {
    // Assume you have a service to get the logged-in user's details
    // You would inject the service and use it to set the username
    this.username = this.supabase.user.id; // Replace with actual username


    this.sessionService.employee.subscribe(async (employee) => {
      console.log('employee updated!', employee);
      const profile = this.sessionService.getLoggedInEmployee();
      if (profile) {
        const { data } = await this.supabase.downLoadImage(profile.avatar_url);
        this.avatar = this.dom.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(data)
        );
        this.username = profile?.first_name;
      }
    });
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
