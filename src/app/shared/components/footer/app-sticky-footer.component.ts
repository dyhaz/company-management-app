import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sticky-footer',
  templateUrl: './app-sticky-footer.component.html',
  styleUrls: ['app-sticky-footer.component.scss'],
})
export class AppStickyFooterMenuComponent {
  constructor(
    public router: Router,
    public navCtrl: NavController
  ) {}

  goTo(path: string) {
    // this.router.navigate([path]);
    this.navCtrl.navigateRoot([path]);
  }
}
