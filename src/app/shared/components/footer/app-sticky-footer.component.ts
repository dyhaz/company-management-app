import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sticky-footer',
  templateUrl: './app-sticky-footer.component.html',
  styleUrls: ['app-sticky-footer.component.scss'],
})
export class AppStickyFooterMenuComponent {
  constructor(public router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
