import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * ruta a la que iba el usuario no logeado, se almaecena y al redigir se limpia
   */
  cachedRoute: string;
  constructor(
    private router: Router,
    private userService: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = localStorage.getItem('authToken');
    console.log({ route: route.routeConfig });
    if (route.routeConfig.path.startsWith('login')) {
      /**
       * Si está logeado no puede ir al login
       */
      if (!isAuthenticated) {
        return true;
      } else {
        if (!this.userService.data) {
          this.userService.loadData();
        }
        this.router.navigate(['/']);
        return false;
      }
    }

    if (!isAuthenticated) {
      this.cachedRoute = route.routeConfig.path;
  
      // this.navigation.navigateForward('/login');
      this.router.navigateByUrl('/auth');
      return false;
    } else {
      if (!this.userService.data) {
        this.userService.loadData();
      }
      
      if (this.cachedRoute) {
        const redirectRoute = `/${this.cachedRoute}`;
        this.cachedRoute = undefined;
        // this.navigation.navigateForward(redirectRoute);
        this.router.navigate([redirectRoute]);
      }
      return true;
    }
  }
}
