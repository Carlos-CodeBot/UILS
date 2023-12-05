import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ViewWillEnter, ViewWillLeave, iosTransitionAnimation } from '@ionic/angular';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { Trip, TripsService } from 'src/app/services/trips.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

enum MapModes {
  PUBLISH_ROUTE = 0,
  VIEW_COORDS = 1,
  ON_TRIP = 2
}

L.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  providers: [DatePipe],
})
export class MapPage implements AfterViewInit, OnInit, ViewWillEnter, ViewWillLeave {
  trip: Trip;
  tripSub: Subscription;
  mode: MapModes;
  stops: {
    marker: L.Marker;
    coord: string;
    address?: string;
  }[] = [];
  private map!: L.Map;


  constructor(
    private service: MapService,
    private header: HeaderService,
    private dialog: DialogService,
    private tripService: TripsService,
    private snackbar: SnackbarService,
    private user: UserService,
    private router: NavController,
    private datePipe: DatePipe,
    private loading: LoadingController
  ) { }

  ngOnInit(): void {
    //Bucaramanga
    const map = L.map('map').setView([7.1193, -73.1227], 13)
    map.whenReady(() => this.initMap(map))
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  }

  initMap(map: L.Map) {

    this.map = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    

    setTimeout(() => this.map.invalidateSize(), 200);
  }

  ngAfterViewInit(): void {
    this.map.whenReady(() => this.initMap);
  }

  async ionViewWillEnter() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }

    this.header.setTitle('Mapa');
    
    const inPublishRoute = localStorage.getItem('tempPublish');
    if (this.service.publishRoute || inPublishRoute) {
      this.header.setTitle('Publicar ruta');
      this.header.setGoBack();
      this.mode = MapModes.PUBLISH_ROUTE;
      this.setUpCanSetMarkers();
      if (inPublishRoute) {
        this.snackbar.show({
          message: 'Para comenzar, selecciona de 1 a 4 paradas en tu viaje',
          type: 'info',
          options: {
            icon: 'information-circle',
            duration: 8000,
          }
        });
      }
      if (this.service.publishRoute) {
        this.stops = [];
        this.setMarkers(
          this.service.publishRoute.map((item) => item.coord),
          true
        );
      }
    }

    const tempCoords = localStorage.getItem('tempCoords');

    if (tempCoords) {
      this.setMarkers(JSON.parse(tempCoords), false);
      this.header.setGoBack();
    }

    const trip = localStorage.getItem('trip');

    if (trip || this.tripService.currTrip) {
      this.header.setTitle('Detalle del viaje');
      this.mode = MapModes.ON_TRIP;
      if (this.tripService.currTrip) {
        this.trip = this.tripService.currTrip;
      } else {
        this.trip = JSON.parse(trip);
      }
      this.setMarkers(this.trip.coordinates, false);
      if (!(await this.snackbar.snackbarIsOnTop())) {
        setTimeout(() => {
          this.snackbar.show({
            message: `Tu viaje sale a las ${this.datePipe.transform(this.trip.departureTime, 'h:mm a')}`,
            type: 'info',
            options: {
              icon: 'information-circle',
              duration: null,
            }
          })
        }, 2000);
      }
    } else {
      this.tripSub = this.tripService.currTrip$.subscribe((value) => {
        if (!value) return;
        this.header.setTitle('Detalle del viaje');
        this.trip = value;
      });
    }
  }

  ionViewWillLeave(): void {
    if (localStorage.getItem('tempCoords')) {
      localStorage.removeItem('tempCoords');
    }
    
    if (localStorage.getItem('tempPublish')) {
      localStorage.removeItem('tempPublish');
      this.map?.removeEventListener('click');
    }

    if (this.trip) {
      this.trip = undefined;
    }

    this.tripSub?.unsubscribe();

  }

  setMarkers(coords: string[], editable?: boolean) {
    coords.forEach((coord) => {
      if (!coord) return;
      // Split the string into latitude and longitude parts
      const [latitudeStr, longitudeStr] = coord.split(',');

      // Convert the string values to numbers
      const latitude = parseFloat(latitudeStr);
      const longitude = parseFloat(longitudeStr);

      const marker = L.marker([latitude, longitude], { draggable: false }).addTo(this.map);
      if (editable) {
        this.addMarker(marker, latitude, longitude);
      }
    })
  }

  leaveTrip() {
    if (this.trip?.id === undefined) return;
    this.dialog.show({
      header: {
        title: 'Abandonar viaje',
        icon: 'logout',
      },
      type: 'warning',
      content: 'Estás seguro que deseas abandonar el viaje?',
      actions: {
        primary: {
          name: 'Cancelar',
          action: (dialogCtrl) => {
            dialogCtrl.dismiss();
          },
        },
        dismiss: {
          name: 'Aceptar',
          action: (dialogCtrl) => {
            this.tripService.leave(this.trip.id).subscribe({
              next: (res) => {
                if (!res) return;
                localStorage.removeItem('onTrip');
                localStorage.removeItem('trip');

                this.router.navigateBack('/home', { animation: iosTransitionAnimation });
              },
              error: (err) => this.snackbar.showBackError(err),
            })
            dialogCtrl.dismiss();
          }
        }
      }
    });
  }

  viewTrip() {
    if (!this.trip) return;

    this.dialog.show({
      header: {
        title: 'Información del viaje',
        icon: 'info',
      },
      content:
        `
      <ion-text class="clamp-3"><strong>Paradas: </strong> ${this.trip.dirRoutes.join(', ')}</ion-text>
      <ion-text><strong>Asientos disponibles: </strong> ${this.trip.availableSeats}</ion-text><br />
      <ion-text><strong>Vehiculo: </strong> ${this.trip.vehicle.brand} - ${this.trip.vehicle.model}</ion-text><br />
      <ion-text><strong>Precio: </strong> ${this.trip.price} COP</ion-text>
    `,
      actions: {
        dismiss: {
          name: 'Cerrar',
        }
      }
    });
  }

  finishTrip() {
    if (!this.trip) return;

    this.dialog.show({
      header: {
        title: 'Finalizar viaje',
        icon: 'done',
      },
      type: 'success',
      content: 'Si ya llegaste a tu lugar de destino y el conductor no ha finalizado el viaje dale en "Aceptar".',
      actions: {
        primary: {
          name: 'Aceptar',
          action: async (dialogCtrl) => {
            dialogCtrl.dismiss();

            const loading = await this.createLoadingSpinner();

            loading.present();
            this.tripService.finish(this.trip.id).subscribe({
              next: (res) => {
                loading.dismiss();
                if (!res) return;

                localStorage.removeItem('onTrip');
                localStorage.removeItem('trip');
                if (this.user.data?.role === 'driver') {
                  this.router.navigateBack(
                    '/home-driver',
                    { animation: iosTransitionAnimation }
                  );  
                  this.trip = null;
                  this.tripService.currTrip = null;
                } else {
                  this.router.navigateBack('/home', { animation: iosTransitionAnimation });
                }
              },
              error: (err) => {
                loading.dismiss();
                this.snackbar.showBackError(err);
              },
            })
          }
        },
        dismiss: {
          name: 'Cerrar',
        }
      }
    });
  }

  setUpCanSetMarkers() {
    this.map.on('click', (e) => {
      if (this.stops.length < 4) {
        const marker = L.marker(e.latlng).addTo(this.map);
        this.addMarker(marker, e.latlng.lat, e.latlng.lng);
      }
    });
  }

  /**
   * Driver add stop (marker) to publish a route
   */
  addMarker(marker: L.Marker, latitude: number, longitude: number) {
    this.stops.push({
      marker,
      coord: `${latitude},${longitude}`,
    });

    const i = this.stops.length - 1;

    marker.on('click', (_e) => {
      marker.remove();
      if (this.stops.length === 1) {
        this.stops = [];
      } else {
        this.stops.splice(i, 1);
      }
    });

    this.service.getAddress(latitude, longitude).subscribe({
      next: (res: any) => {
        console.log({ res });
        try {
          this.stops[i].address = this.formatDirection(res.display_name);
        } catch (e) {
          console.error(e);
          this.stops[i].address = res.display_name;
        }
      },
      error: (_err) => {
        this.snackbar.show({
          message: 'No se pudo obtener la dirección del marcador',
          type: 'error',
        })
      }
    })
  }

  goToNextStep() {
    localStorage.setItem(
      'tempData',
      JSON.stringify(
        this.stops.map((stop) => ({ coord: stop.coord, address: stop.address }))
      )
    );
    this.router.navigateForward('publish-route')
  }

  departuretimeDifference(start = 0): boolean {
    const currentTime = new Date();
    const departureTime = new Date(this.trip.departureTime);
    const departureMinutes = (departureTime.getHours() * 60) + departureTime.getMinutes();
    const currentMinutes = (currentTime.getHours() * 60) + currentTime.getMinutes();

    return (departureMinutes - currentMinutes) <= start;

  }

  private formatDirection(addressString: string) {
    const partArray = addressString.split(', ');
    const keywords = ['comuna', 'calle', 'carrera'];
    const indexes = [];
    partArray.forEach((value, i) => {
      if (
        keywords.some((str) => value.toLowerCase().includes(str))
      ) {
        indexes.push(i);
      }
    })
    return indexes.map((i) => partArray[i]).join(', ');
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
