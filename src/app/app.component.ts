import {Component, ElementRef, Renderer2} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { SupabaseService } from './shared/services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public currentPage = '';
  public showHeader = true;
  public showFooter = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
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
        this.showHeader = !currentRoute.includes('Login') && !currentRoute.includes('Register');
        this.showFooter = !currentRoute.includes('Login') && !currentRoute.includes('Register');
        console.log('Current Route:', currentRoute);
        this.fixScreenLayout();
      }
    });
  }

  fixScreenLayout() {
    setTimeout(() => {
      const el1 = this.el.nativeElement.querySelectorAll('.menu-footer'); // Ambil elemen menu-footer menggunakan ElementRef
      const pageContentElements = ['app-employee', 'app-account'];
      const el2: any = [];
      pageContentElements.forEach((str) => {
        el2.push(this.el.nativeElement.querySelectorAll(str)); // Ambil elemen page-content menggunakan ElementRef
      });
      if (el1) {
        el1.forEach((footer: HTMLElement) => {
          el2.forEach((pages: any) => {
            try {
              pages.forEach((page: any) => {
                this.renderer.setStyle(page, 'padding-bottom', footer.offsetHeight + 'px');
              });
            } catch (e) {
            }
          });
        });
      }
    }, 300);
  }

  private getCurrentRoute(): string {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route?.routeConfig?.component?.name ?? '';
  }
}
