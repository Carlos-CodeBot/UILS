import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * ruta a la que iba el usuario no logeado, se almaecena y al redigir se limpia
   */
  cachedRoute: string;
  constructor(
    private router: NavController,
    private user: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = localStorage.getItem('authToken');
    const path = route.routeConfig.path;
    if (path.startsWith('auth')) {
      if (
        route.children[0].routeConfig.path === 'register-vehicle' &&
        this.user.data?.vehicle === null &&
        this.user.data?.role === 'driver'
      ) {
        return true;
      }
      /**
       * Si está logeado no puede ir al login
       */
      if (!isAuthenticated) {
        return true;
      } else {
        if (!this.user.data) {
          this.user.loadData();
        }
        this.router.navigateForward('/');
        return false;
      }
    }

    if (!isAuthenticated) {
      this.cachedRoute = route.routeConfig.path;
  
      this.router.navigateForward('/login');
      return false;
    } else {
      if (!this.user.data) {
        this.user.loadData();
      }

      /**
       * Driver cannot go to passenger home page
       * and Passenger cannot go to driver home page
       */
      if (path === 'home' && this.user.data?.role === 'driver') { 

        this.router.navigateForward('/home-driver');
        return false;
      } else if (path === 'home-driver' && this.user.data?.role === 'passenger') {
        this.router.navigateForward('/home');
        return false;
      }

      /**
       * when user is enrolled in a trip, he cannot go to home page
       */
      if (path === 'home' && this.user.data?.role === 'passenger' && localStorage.getItem('onTrip')) {
        this.router.navigateForward('/map');
        return false;
      }
      
      if (this.cachedRoute) {
        const redirectRoute = `/${this.cachedRoute}`;
        this.cachedRoute = undefined;
        // this.navigation.navigateForward(redirectRoute);
        this.router.navigateForward(redirectRoute);
      }
      return true;
    }
  }
}
