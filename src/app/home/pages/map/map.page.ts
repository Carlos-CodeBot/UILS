import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavController, ViewWillEnter, ViewWillLeave, iosTransitionAnimation } from '@ionic/angular';
import * as L from 'leaflet';
import { MapService } from 'src/app/services/map.service';
import { Trip, TripsService } from 'src/app/services/trips.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

L.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit, OnInit, ViewWillLeave {
  trip: Trip;
  private map!: L.Map;


  constructor(
    private service: MapService,
    private header: HeaderService,
    private dialog: DialogService,
    private tripService: TripsService,
    private snackbar: SnackbarService,
    private router: NavController,
  ) { }

  ngOnInit(): void {
    this.header.setTitle('Mapa');
    if (!localStorage.getItem('onTrip')) {
      this.header.setGoBack();
    }

    //Bucaramanga
    const map = L.map('map').setView([7.1193, -73.1227], 13)
    map.whenReady(() => this.initMap(map))
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  }

  initMap(map: L.Map) {

    this.map = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    
    const tempCoords = localStorage.getItem('tempCoords');

    if (tempCoords) {
      this.setMarkers(JSON.parse(tempCoords), false)
    }

    const trip = localStorage.getItem('trip');
    if (trip) {
      this.trip = JSON.parse(trip);
      this.setMarkers(this.trip.coordinates, false)
    }

    this.map.invalidateSize();
  }

  ngAfterViewInit(): void {
    this.map.whenReady(() => this.initMap);
  }

  ionViewWillLeave(): void {
    if (localStorage.getItem('tempCoords')) {
      localStorage.removeItem('tempCoords');
    }
  }

  setMarkers(coords: string[], draggable?: boolean) {
    coords.forEach((coord) => {
      // Split the string into latitude and longitude parts
      const [latitudeStr, longitudeStr] = coord.split(',');

      // Convert the string values to numbers
      const latitude = parseFloat(latitudeStr);
      const longitude = parseFloat(longitudeStr);

      L.marker([latitude, longitude], {draggable}).addTo(this.map);
    })
  }

  mapClicked(event) {
    console.log('map clicked', { event });
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
      content: `<strong>Paradas: </strong> ${this.trip.dirRoutes.join(', ')} <br />`,
      actions: {
        dismiss: {
          name: 'Cerrar',
        }
      }
    });
  }
}
