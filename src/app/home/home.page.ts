import { Component } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  menuItems = [
    { label: 'Employees', icon: 'people-outline', path: '/employee' },
    { label: 'Profile', icon: 'person-outline', path: '/account' },
    { label: 'Company', icon: 'business-outline', path: '/company' },
    { label: 'Settings', icon: 'settings-outline', path: '/settings' },
    // Add more menu items here
  ];

  constructor(private navCtrl: NavController) {}

  navigateTo(path: string) {
    this.navCtrl.navigateRoot(path);
  }
}
