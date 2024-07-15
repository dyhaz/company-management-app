import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SupabaseService } from './shared/services/supabase.service';
import { SessionService } from './core/state/session/session.service';

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
    private sessionService: SessionService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.supabase.authChanges(async (_, session) => {
      console.log(_);

      if (_ === 'SIGNED_IN') {
        console.log('session', session);

        this.sessionService.updateSession({
          accessToken: session.access_token,
          tokenType: session.token_type
        });

        setTimeout(async () => {
          const user = await this.supabase.obtainUser();

          this.sessionService.updateUser({
            uid: user.id,
            email: user.email,
            username: user.email,
            id: 1
          });

          this.obtainUserSession();
          this.obtainEmployeeSession();

          if (session?.user) {
            // TODO: add validation only redirect if previous page is login
            this.router.navigate(['/account']);
          }
        }, 100);
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
      const pageContentElements = ['app-employee', 'app-account', 'app-company'];
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

  private async obtainUserSession() {
    const loader = await this.supabase.createLoader();
    await loader.present();
    try {
      const { data: userDetail, error, status } = await this.supabase.obtainUserDetail();
      if (error && status !== 406) {
        throw error;
      }

      const user = await this.supabase.obtainUser();

      this.sessionService.updateUser({
        uid: user.id,
        email: user.email,
        username: userDetail?.username ?? '',
        id: userDetail?.id
      });

      await loader.dismiss();
    } catch (error) {
      await loader.dismiss();
      await this.supabase.createNotice(error.message);
    }
  }

  private async obtainEmployeeSession() {
    const loader = await this.supabase.createLoader();
    await loader.present();
    try {
      const { data: profile, error, status } = await this.supabase.obtainProfile();
      if (error && status !== 406) {
        throw error;
      }

      this.sessionService.updateEmployee({
        avatar_url: profile.avatar_url,
        department: profile.department,
        last_name: profile.last_name,
        first_name: profile.first_name,
        position: profile.position,
      });

      await loader.dismiss();
    } catch (error) {
      await loader.dismiss();
      await this.supabase.createNotice(error.message);
    }
  }
}
