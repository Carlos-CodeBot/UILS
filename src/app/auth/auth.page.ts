import { Component } from '@angular/core';
import { NavController, iosTransitionAnimation } from '@ionic/angular';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
    backgroundImages = [
        './assets/images/login-3.jpg',
        './assets/images/login-4.jpg',
        './assets/images/login-5.jpg',
        './assets/images/login-6.jpg',
        './assets/images/login-7.jpg',
        './assets/images/login-8.jpg',
        './assets/images/login-9.jpg',
        './assets/images/login-10.jpg',
        './assets/images/login-11.jpg',
        './assets/images/login-12.jpg',
    ];

    public bgImage = this.backgroundImages[Math.floor(Math.random() * 9)];

    constructor(
        private router: NavController
    ) { }

    redirect(to: 'login' | 'signup') {
        this.router.navigateForward(`/auth/${to}`, { animation: iosTransitionAnimation });
    }

}