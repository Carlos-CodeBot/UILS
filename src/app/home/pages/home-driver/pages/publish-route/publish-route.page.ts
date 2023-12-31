import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { TripsService } from 'src/app/services/trips.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DatePipe } from '@angular/common';
import { MapService } from 'src/app/services/map.service';
import { SelectComponent } from 'src/app/shared/standalone-components/select/select.component';
import { SelectArgs } from 'src/app/shared/standalone-components/select/models/select-args.model';
// import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './publish-route.page.html',
  styleUrls: ['./publish-route.page.scss'],
  providers: [DatePipe],
})
export class PublishRoutePage implements OnInit, ViewWillEnter, ViewWillLeave{
  @ViewChild("placeSelect") placeSelect: SelectComponent;
  public placeConfig: SelectArgs;
  public form: FormGroup;
  public minTime: string;
  constructor(
    private header: HeaderService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private router: NavController,
    private tripsService: TripsService,
    private datePipe: DatePipe,
    private mapService: MapService,
    private loading: LoadingController
  ) { }

  ngOnInit(): void {
    this.placeConfig = {
      headerOpts: {
        title: 'Selecciona el lugar de salida',
      },
      options: [
        {
          id: 'bucaramanga',
          nombre: 'Bucaramanga',
        },
        {
          id: 'piedecuesta',
          nombre: 'Piedecuesta',
        },
        {
          id: 'girón',
          nombre: 'Girón',
        },
        {
          id: 'floridablanca',
          nombre: 'Floridablanca',
        },
        {
          id: 'rionegro',
          nombre: 'Rio negro',
        },
      ],
      placeholder: 'Lugar de salida',
      helperText: 'Lugar de salida',
      initialOption: {
        id: 'bucaramanga',
        nombre: 'Bucaramanga',
      },
    };
  }

  ionViewWillEnter(): void {
    this.header.setTitle('Publicar ruta');
    this.header.setGoBack();
    if (!localStorage.getItem('tempData')) {
      this.router.navigateBack('');
    }
    this.mapService.publishRoute = JSON.parse(localStorage.getItem('tempData'));
    this.buildForm();
    this.form.controls.startingPlace.setValue('bucaramanga');

    this.minTime = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  }

  ionViewWillLeave(): void {
    this.header.removeGoBack();
    localStorage.removeItem('tempData');
  }

  async publishRoute() {
    const raw = localStorage.getItem('tempData');
    if (!raw) return;
    const data = JSON.parse(raw) as any[];
    const result = data.reduce((acc, currItem) => {
      const { coord, address } = currItem;

      acc.coords.push(coord);
      acc.addresses.push(address);

      return acc;
    }, { coords: [], addresses: [] });

    const loading = await this.createLoadingSpinner();

    loading.present();

    this.tripsService.new({
      dirRoutes: result.addresses,
      coordinates: result.coords,
      price: this.form.value.price,
      departureTime: this.datePipe.transform(this.form.value.departureTime, 'HH:mm:ss'),
      startingPlace: this.form.value.startingPlace,
    }).subscribe({
      next: (res) => {
        loading.dismiss();
        if (!res) return;

        /**
         * Carga el viaje creado por el conductor
         */
        this.tripsService.loadCurrent();
        this.snackbar.show({
          message: '¡Has publicado un viaje exitosamente!',
          type: 'success',
        });
        localStorage.setItem('onTrip', '1');
        this.router.navigateForward('/home-driver');
      },
      error: (err) => {
        loading.dismiss();
        this.snackbar.showBackError(err);
      },
    })
  }

  departureTimeChange(event) {
    this.form.controls.departureTime.setValue(event.detail.value);
  }

  placeSelectionChange(id: any) {
    this.form.controls.startingPlace.setValue(id);
  }

  private buildForm() {
    this.form = this.fb.group({
      price: ['', [Validators.required, this.priceValidator]],
      departureTime: ['', [Validators.required]],
      startingPlace: ['', [Validators.required]],
    })
  }

  private priceValidator(control) {
    const value = control.value;
    if (!value) return;

    if (value < 2000) {
      return { minValue: true };
    } else if (value > 20000) {
      return { maxValue: true };
    }

    return null;
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
