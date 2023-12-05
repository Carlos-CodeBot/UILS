import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, NavController, ViewWillEnter, ViewWillLeave, iosTransitionAnimation } from '@ionic/angular';
import { Subject, Subscription, interval, startWith, switchMap, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Trip, TripsService } from 'src/app/services/trips.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy, ViewWillEnter, ViewWillLeave {
  private destroy$ = new Subject<void>(); // Subject to trigger the "takeUntil" condition
  trips: Trip[];
  tripsSub: Subscription;
  constructor(
    private auth: AuthService,
    private tripsService: TripsService,
    private snackbar: SnackbarService,
    private router: NavController,
    private header: HeaderService,
    private loading: LoadingController,
    public user: UserService
  ) { }

  ionViewWillEnter(): void {
    this.header.hide();
    this.concurrentGetTrips();
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

    this.tripsService.currTrip$.pipe(take(1)).subscribe((trip) => {
      if (!trip) return;

      this.router.navigateForward('/map');
    })
  }

  ionViewWillLeave(): void {
    this.tripsSub?.unsubscribe();
  }

  concurrentGetTrips() {
    this.tripsSub = this.getTrips().subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          this.trips = null;
          return;
        };

        this.trips = res.map((trip) => {
          trip.departureTime = new Date('1970-01-01 ' + trip.departureTime).toString();
          return trip;
        });
      },
      error: (err) => this.snackbar.showBackError(err),
    });
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
    this.tripsSub?.unsubscribe();
  }

  viewInMap(coordinates: string[]) {
    localStorage.setItem('tempCoords', JSON.stringify(coordinates));
    this.router.navigateForward('/map', {animation: iosTransitionAnimation});
  }

  async joinTrip(trip: Trip) {
    const loading = await this.createLoadingSpinner();

    loading.present();

    this.tripsService.join(trip.id).subscribe({
      next: (res) => { 
        loading.dismiss();
        if (!res) return;

        this.snackbar.show({
          message: 'Te has embarcado en un nuevo viaje! Puedes comunicarte con el conductor yendo al menú "chat"',
          type: 'info',
          options: {
            duration: null
          }
        });

        this.tripsService.currTrip = trip;
        this.tripsService.currTrip$.next(trip);
        this.router.navigateForward('/map', { animation: iosTransitionAnimation });

      },
      error: (err) => {
        loading.dismiss();
        this.snackbar.showBackError(err);
      },
    })
  }

  /** Pull to refresh is performed by the user */
  onRefresh(event?: any) {
    this.tripsService.getAll().subscribe({
      next: (res) => {
        event?.target?.complete();
        if (!res || res.length === 0) {
          this.trips = null;
          return;
        };

        this.trips = res.map((trip) => {
          trip.departureTime = new Date('1970-01-01 ' + trip.departureTime).toString();
          return trip;
        });
      },
      error: (err) => {
        event?.target?.complete();
        this.snackbar.showBackError(err);
      },
    })
  }

  /**
   * Método para crear el spinner de carga
   *
   * @returns loading element
   */
  private async createLoadingSpinner() {
    const loading = await this.loading.create({
      backdropDismiss: false,
      message: '',
      cssClass: 'loading--empty',
    });
    return loading;
  }
}
 