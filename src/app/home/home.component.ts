import { Component, OnInit } from '@angular/core';
import { isRoute } from '../utils/routes';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { UserService } from '../services/user.service';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { TripsService } from '../services/trips.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, ViewWillEnter {
    menus: {
        route: string;
        name: string;
        icon: string;
        active: boolean;
    }[];

    routeSub: Subscription;

    constructor(
        private navCtrl: NavController,
        private user: UserService,
        private trip: TripsService,
        public navbar: NavbarService,
        public router: Router
    ) { }

    ngOnInit() {
        this.setMenus();
        this.user.data$.subscribe((data) => {
            if (!data) return;
            if (this.router.url === '/home' && data.role === 'driver') {
                this.navCtrl.navigateForward('/home-driver')
            }

            this.trip.loadCurrent();
        })
    }

    ionViewWillEnter(): void {
        if (!localStorage.getItem('authToken')) {
            this.navCtrl.navigateForward('/auth');
            return;
        }
    }

    setMenus() {
        this.menus = [
            {
                route: 'home',
                name: 'Home',
                icon: 'home',
                active: isRoute(
                    this.router.url,
                    'home'
                ),
            },
            {
                route: 'chat',
                name: 'Chat',
                icon: 'chat',
                active: isRoute(
                    this.router.url,
                    'chat'
                ),
            },
            {
                route: 'account',
                name: 'Cuenta',
                icon: 'account_circle',
                active: isRoute(
                    this.router.url,
                    'account'
                ),
            },
        ];

        /**
         * Revisa los cambios de ruta para activar o desactivar los menús en el bottom-nav
         */
        this.routeSub = this.router.events
            .pipe(
                filter(
                    (event) =>
                        event instanceof NavigationEnd || event instanceof NavigationStart
                )
            )
            .subscribe((event: NavigationEnd | NavigationStart) => {
                if (!this.menus) return;
                this.menus = this.menus.map((menu) => {
                    /** Asigna el menú como activo o desactivo */
                    menu.active = isRoute(
                        (event instanceof NavigationEnd && event.url === '/' && event.urlAfterRedirects) ? event.urlAfterRedirects : event.url,
                        menu.route
                    );
                    return menu;
                });
            });
    }
}
