import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public currentPage = '';
  public showHeader = true;
  public showFooter = true;

  constructor(private supabase: SupabaseService, private router: Router) {
    this.supabase.authChanges((_, session) => {
      console.log(session);
      if (session?.user) {
        this.router.navigate(['/account']);
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Get the current route
        const currentRoute = this.getCurrentRoute();
        this.currentPage = currentRoute;
        console.log('Current Route:', currentRoute);
      }
    });
  }

  private getCurrentRoute(): string {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route?.routeConfig?.component?.name ?? '';
  }
}
