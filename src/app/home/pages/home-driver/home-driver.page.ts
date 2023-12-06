import { Component, OnInit } from '@angular/core';
import { NavController, ViewWillEnter, iosTransitionAnimation } from '@ionic/angular';
import { take } from 'rxjs';
import { TripsService } from 'src/app/services/trips.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  templateUrl: './home-driver.page.html',
  styleUrls: ['./home-driver.page.scss']
})
export class HomeDriverPage implements OnInit, ViewWillEnter {
  constructor(
    private snackbar: SnackbarService,
    private router: NavController,
    private header: HeaderService,
    private dialog: DialogService,
    public tripsService: TripsService,
    public user: UserService
  ) { }

  ngOnInit(): void { }

  ionViewWillEnter(): void {
    this.header.hide();

    if (this.user.data) {
      if (
        this.user.data.role === 'driver' &&
        this.user.data.vehicle === null
      ) {
        this.router.navigateForward('/auth/register-vehicle');
      }
    } else {
      this.user.data$.pipe(take(1)).subscribe((data) => {
        if ( data.role === 'driver' && data.vehicle === null) {
          this.router.navigateForward('/auth/register-vehicle');
        }
      })
    }
  }
  
  goToPublishRoute() {
    localStorage.setItem('tempPublish', '1');
    this.router.navigateForward('/map', {animation: iosTransitionAnimation})
  }

  goToDetail() {
    this.router.navigateForward('/map', { animation: iosTransitionAnimation });
  }

  removeTrip() {
    if (this.departureTimeDifference(30)) {
      this.snackbar.show({
        message: 'No puedes eliminar un viaje a menos de 30 minutos de partir.',
        type: 'warning'
      });
      return;
    }

    this.dialog.show({
      header: {
        title: 'Eliminar viaje',
        icon: 'error',
      },
      type: 'warning',
      content: '¿Estás seguro que quieres eliminar el viaje? Se les notificará a los pasajeros que el viaje ha sido eliminado.',
      actions: {
        primary: {
          name: 'Eliminar',
          action: (dialogRef) => {
            dialogRef.dismiss();
            this.tripsService.delete(this.tripsService.currTrip.id).subscribe({
              next: (_res) => {
                this.snackbar.show({
                  message: '¡El viaje se ha eliminado exitosamente!',
                  type: 'success',
                });
                localStorage.removeItem('onTrip');
                localStorage.removeItem('trip');
                this.tripsService.currTrip = null;
              },
              error: (err) => this.snackbar.showBackError(err),
            })
          },
        },
        dismiss: {
          name: 'Cancelar',
        },
      },
    })
  }

  departureTimeDifference(start = 0): boolean {
    const currentTime = new Date();
    const departureTime = new Date(this.tripsService.currTrip.departureTime);
    const departureMinutes = (departureTime.getHours() * 60) + departureTime.getMinutes();
    const currentMinutes = (currentTime.getHours() * 60) + currentTime.getMinutes();

    return (departureMinutes - currentMinutes) <= start;

  }
}
