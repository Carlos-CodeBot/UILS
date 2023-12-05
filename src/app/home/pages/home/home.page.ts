import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ViewWillEnter, iosTransitionAnimation } from '@ionic/angular';
import { Subject, interval, startWith, switchMap, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MapService } from 'src/app/services/map.service';
import { Trip, TripsService } from 'src/app/services/trips.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, ViewWillEnter {
  private destroy$ = new Subject<void>(); // Subject to trigger the "takeUntil" condition
  trips: Trip[];
  constructor(
    private auth: AuthService,
    private tripsService: TripsService,
    private snackbar: SnackbarService,
    private router: NavController,
    private header: HeaderService,
    public user: UserService
  ) { }

  ngOnInit(): void {
    this.user.data$.pipe(take(1)).subscribe((data) => {
      console.log({ data });
      if (data?.role === 'driver' && data?.vehicle === null) {
        this.router.navigateForward('/auth/register-vehicle');
      }
    })
    this.getTrips().subscribe({
      next: (res) => {
        if (!res) return;

        this.trips = res.map((trip) => {
          trip.departuretime = new Date('1970-01-01 ' + trip.departuretime).toDateString();
          return trip;
        });
        console.log({ trips: this.trips });
      },
      error: (err) => this.snackbar.showBackError(err),
    });
  }

  ionViewWillEnter(): void {
    this.header.hide();
    if (localStorage.getItem('onTrip')) {
      this.router.navigateForward('/map', { animation: iosTransitionAnimation });
    }
    if (
      this.user.data &&
      this.user.data.role === 'driver' &&
      this.user.data.vehicle === null
    ) {
      this.router.navigateForward('/auth/register-vehicle');
    }
  }

  getTrips() {
    return interval(5 * 60 * 1000) // 5 minutes in ms
      .pipe(
        startWith(0), // Emit 0 immediately
        switchMap(() => this.tripsService.getAll()),
        takeUntil(this.destroy$)
      );
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Trigger the subject to stop emissions
    this.destroy$.complete(); // Complete the subject to release resources
  }

  viewInMap(coordinates: string[]) {
    localStorage.setItem('tempCoords', JSON.stringify(coordinates));
    this.router.navigateForward('/map', {animation: iosTransitionAnimation});
  }

  takeTrip(trip: Trip) {
    this.tripsService.join(trip.id).subscribe({
      next: (res) => { 
        if (!res) return;

        this.snackbar.show({
          message: 'Te has embarcado en un nuevo viaje! Puedes comunicarte con el conductor yendo al menú "chat"',
          type: 'info',
          options: {
            duration: null
          }
        });

        localStorage.setItem('onTrip', '1');
        localStorage.setItem('trip', JSON.stringify(trip));
        this.router.navigateForward('/map', { animation: iosTransitionAnimation });

      },
      error: (err) => this.snackbar.showBackError(err),
    })
  }
}
 