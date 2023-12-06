import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { SelectArgs } from 'src/app/shared/standalone-components/select/models/select-args.model';

@Component({
  templateUrl: './register-vehicle.page.html',
  styleUrls: ['./register-vehicle.page.scss']
})
export class RegisterVehiclePage {
  form: FormGroup;
  selectColorConfig: SelectArgs;
  selectCapacityConfig: SelectArgs;
  constructor(
    private router: NavController,
    private fb: FormBuilder,
    private userService: UserService,
    private snackbar: SnackbarService,
    private user: UserService
  ) { }

  ionViewWillEnter() {
    this.buildForm();
    this.selectColorConfig = {
      headerOpts: {
        title: 'Selecciona el color del vehiculo',
      },
      options: [
        {
          id: 'blanco',
          nombre: 'Blanco',
        },
        {
          id: 'negro',
          nombre: 'Negro',
        },
        {
          id: 'plateado',
          nombre: 'Plateado',
        },
        {
          id: 'azul',
          nombre: 'Azul',
        },
        {
          id: 'rojo',
          nombre: 'Rojo',
        },
        {
          id: 'verde',
          nombre: 'Verde',
        },
        {
          id: 'amarillo',
          nombre: 'Amarillo',
        },
        {
          id: 'naranja',
          nombre: 'Naranja',
        },
        {
          id: 'marron',
          nombre: 'Marron',
        },
        {
          id: 'beige',
          nombre: 'Beige',
        },
        {
          id: 'dorado',
          nombre: 'Dorado',
        },
        {
          id: 'morado',
          nombre: 'Morado',
        },
      ],
      placeholder: 'Color del vehiculo', 
    }

    this.selectCapacityConfig = {
      headerOpts: {
        title: 'Selecciona la capacidad del vehiculo',
      },
      options: [
        {
          id: 1,
          nombre: '1',
        },
        {
          id: 2,
          nombre: '2',
        },
        {
          id: 3,
          nombre: '3',
        },
        {
          id: 4,
          nombre: '4',
        },
        {
          id: 5,
          nombre: '5',
        },
      ],
      placeholder: 'Capacidad del vehiculo'
    }
  }

  ionViewWillLeave(): void {
  }

  register() {
    this.userService.registerVehicle({
      brand: this.form.value.brand,
      model: this.form.value.model,
      licensePlate: this.form.value.licensePlate,
      color: this.form.value.color,
      capacity: this.form.value.capacity,
    }).subscribe({
      next: () => {
        this.user.loadData();
        this.router.navigateForward('');
      },
      error: (err) => this.snackbar.showBackError(err),
    })

  }

  onLicensePlateInput(event: any) {
    const inputValue = event.target.value;
    this.form.controls.licensePlate.setValue(inputValue.toUpperCase(), { emitEvent: false });
  }

  colorSelectionChange(id: string) {
    this.form.controls.color.setValue(id);
  }

  capacitySelectionChange(id: number) {
    this.form.controls.capacity.setValue(id);
  }

  buildForm() {
    this.form = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(4)]],
      licensePlate: ['', [Validators.required, this.licensePlateValidator]],
      color: [null, [Validators.required]],
      capacity: ['', [Validators.required]],
    })
  }

  licensePlateValidator(control) {
    const licensePlate = control.value;

    // Regular expression for a Colombian license plate
    const licensePlateRegex = /^[A-Z]{1,3}\d{2,4}[A-Z]{0,2}$/;

    if (!licensePlateRegex.test(licensePlate)) {
      return { invalidLicensePlate: true };
    }

    return null;
  }
}
