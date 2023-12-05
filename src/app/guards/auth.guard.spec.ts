import { TestBed } from '@angular/core/testing';

import { AuthGuard } from '../guards/auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let router: Router;
  const route = {
    routeConfig: { path: '', title: '' },
  } as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        AuthGuard,
        {
          provide: JwtHelperService,
          useValue: {},
        },
        {
          provide: Storage,
          useValue: {
            create: () => {},
            defineDriver: () => {},
          },
        },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    route.routeConfig.path = '';
  });

  it('should return false if user is not logged in', () => {
    guard.isAuthenticated = false;
    const navigateSpy = spyOn(router, 'navigate');

    expect(guard.canActivate(route)).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return true if user is logged in', () => {
    guard.isAuthenticated = true;

    expect(guard.canActivate(route)).toBeTruthy();
  });

  it('should redirect to home if user go to login and is already logged in', () => {
    guard.isAuthenticated = true;
    route.routeConfig.path = 'login';
    const navigateSpy = spyOn(router, 'navigate');

    expect(guard.canActivate(route)).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
