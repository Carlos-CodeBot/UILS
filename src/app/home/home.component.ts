import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { isRoute } from '../utils/routes';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
    menus: {
        route: string;
        name: string;
        icon: string;
        active: boolean;
    }[];

    routeSub: Subscription;

    constructor(public router: Router) { }

    ngOnInit() {
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
                    event.url,
                     menu.route
                );
                return menu;
            });
            });
    }
}
