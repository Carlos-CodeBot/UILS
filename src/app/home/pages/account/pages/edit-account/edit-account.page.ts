import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Subscription, take } from 'rxjs';
import { optionCapacities, optionColors } from 'src/app/constants/selects';
import { UserService } from 'src/app/services/user.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { SelectArgs } from 'src/app/shared/standalone-components/select/models/select-args.model';
import { SelectComponent } from 'src/app/shared/standalone-components/select/select.component';
import { titleCase } from 'src/app/utils/strings';

@Component({
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss']
})
export class EditAccountPage implements ViewWillEnter, ViewWillLeave {
  @ViewChild("colorSelect") colorSelect: SelectComponent;
  @ViewChild("capacitySelect") capacitySelect: SelectComponent;
  form: FormGroup;
  editMode: 'user' | 'vehicle';
  didChangeData: boolean;
  dataSub: Subscription;
  selectColorConfig: SelectArgs;
  selectCapacityConfig: SelectArgs;
  loadingState: boolean;
  constructor(
    private header: HeaderService,
    private fb: FormBuilder,
    private user: UserService,
    private snackbar: SnackbarService,
    private router: NavController,
    private loading: LoadingController
  ) {}

  ionViewWillEnter(): void {
    this.header.setTitle('Editar cuenta');
    this.header.setGoBack();
    this.buildForm();

    this.user.data$.pipe(take(1)).subscribe((data) => {
      if (!data) return;

      if (this.editMode === 'user') {

        this.form.controls.username.setValue(data.username);
        this.form.controls.fullName.setValue(data.fullName);
        this.form.controls.phoneNumber.setValue(data.phoneNumber);
        this.form.controls.email.setValue(data.email);
        this.form.controls.role.setValue(data.role);
      } else {
        this.form.controls.brand.setValue(data.vehicle?.brand);
        this.form.controls.model.setValue(data.vehicle?.model);
        this.form.controls.licensePlate.setValue(data.vehicle?.licensePlate);
        this.form.controls.color.setValue(data.vehicle?.color);
        this.form.controls.capacity.setValue(data.vehicle?.capacity);

        const cb = () => {
          console.log('?')
          this.colorSelect.manualSetOption({
            id: data.vehicle?.color.toLowerCase(),
            nombre: titleCase(data.vehicle?.color),
          });
  
          this.capacitySelect.manualSetOption({
            id: data.vehicle?.capacity,
            nombre: String(data.vehicle?.capacity),
          });
        }

        if (!this.colorSelect) {
          setTimeout(() => {
            cb();
          }, 300);
        } else {
          cb();
        }
      }

    });
  }

  ionViewWillLeave(): void {
    localStorage.removeItem('tempEdit');
  }

  saveChanges() {
    if (!this.didChangeData) return;

    this.loadingState = true;
    if (this.editMode === 'user') {
      this.saveUserChanges();
    } else if (this.editMode === 'vehicle') {
      this.saveVehicleChanges();
    }
  }

  async saveUserChanges() {
    let body: any = {};
    if (this.form.value.fullName !== this.user.data?.fullName) {
      body.fullName = this.form.value.fullName;
    }

    if (this.form.value.phoneNumber !== this.user.data?.phoneNumber) {
      body.phoneNumber = this.form.value.phoneNumber;
    }

    if (this.form.value.email !== this.user.data?.email) {
      body.email = this.form.value.email;
    }

    const loading = await this.createLoadingSpinner();

    loading.present();
    this.user.editUser(body).subscribe({
      next: (_res) => {
        loading.dismiss();
        this.loadingState = false;
        Object.entries(body).forEach(([key, value]) => {
          this.user.data[key] = value;
        });

        this.snackbar.show({
          message: 'Los datos se han editado exitosamente!',
          type: 'success',
        });

        this.router.navigateBack('/account');
      },
      error: (err) => {
        loading.dismiss();
        this.loadingState = false;
        this.snackbar.showBackError(err)
      },
    });
  }
  
  async saveVehicleChanges() {
    let body: any = {};
    if (this.form.value.brand !== this.user.data?.vehicle?.brand) {
      body.brand = this.form.value.brand;
    }

    if (this.form.value.model !== this.user.data?.vehicle?.model) {
      body.model = this.form.value.model;
    }

    if (this.form.value.licensePlate !== this.user.data?.vehicle?.licensePlate) {
      body.licensePlate = this.form.value.licensePlate;
    }

    if (this.form.value.color !== this.user.data?.vehicle?.color) {
      body.color = this.form.value.color;
    }
    if (this.form.value.capacity !== this.user.data?.vehicle?.capacity) {
      body.capacity = this.form.value.capacity;
    }

    const loading = await this.createLoadingSpinner();

    loading.present();

    this.user.editVehicle(body).subscribe({
      next: (_res) => {
        loading.dismiss();
        this.loadingState = false;
        Object.entries(body).forEach(([key, value]) => {
          this.user.data.vehicle[key] = value;
        });

        this.snackbar.show({
          message: 'Los datos se han editado exitosamente!',
          type: 'success',
        });

        this.router.navigateBack('/account');
      },
      error: (err) => {
        loading.dismiss();
        this.loadingState = false;
        this.snackbar.showBackError(err);
      },
    });
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

  private buildForm() {
    if (localStorage.getItem('tempEdit') === 'user') {
      this.editMode = 'user'
      this.form = this.fb.group({
        username: [{ value: this.user.data?.username, disabled: true }],
        fullName: [this.user.data?.fullName, [Validators.required, this.fullNameValidator]],
        phoneNumber: [this.user.data?.phoneNumber, [Validators.required, this.colombianPhoneNumberValidator]],
        email: [this.user.data?.email, [Validators.required, this.emailValidator]],
        role: [{value: this.user.data?.role, disabled: true}],
      });

      this.form.valueChanges.subscribe((value) => {
        this.didChangeData =
          value.fullName !== this.user.data?.fullName ||
          value.email !== this.user.data?.email ||
          value.phoneNumber !== this.user.data?.phoneNumber;
      })
    } else if (localStorage.getItem('tempEdit') === 'vehicle') {
      this.editMode = 'vehicle';
      const colorConfig: SelectArgs = {
        headerOpts: {
          title: 'Selecciona el color del vehiculo',
        },
        options: optionColors,
        placeholder: 'Color del vehiculo',
        helperText: 'Color del vehiculo',
      };

      const capacityConfig: SelectArgs = {
        headerOpts: {
          title: 'Selecciona la capacidad del vehiculo',
        },
        options: optionCapacities,
        placeholder: 'Capacidad del vehiculo',
        helperText: 'Capacidad del vehiculo',
      };

      if (this.user.data?.vehicle?.color) {
        colorConfig.initialOption = {
          id: this.user.data?.vehicle?.color,
          nombre: this.user.data?.vehicle?.color,
        }
        capacityConfig.initialOption = {
          id: this.user.data?.vehicle?.capacity,
          nombre: String(this.user.data?.vehicle?.capacity),
        }
      }
      this.selectColorConfig = colorConfig;
      this.selectCapacityConfig = capacityConfig;
      
      this.form = this.fb.group({
        brand: [this.user.data?.vehicle?.brand, [Validators.required, Validators.minLength(3)]],
        model: [this.user.data?.vehicle?.model, [Validators.required, Validators.minLength(4)]],
        licensePlate: [this.user.data?.vehicle?.licensePlate, [Validators.required, this.licensePlateValidator]],
        color: [this.user.data?.vehicle?.color, [Validators.required]],
        capacity: [this.user.data?.vehicle?.capacity, [Validators.required]],
      });

      this.form.valueChanges.subscribe((value) => {
        this.didChangeData =
          value.brand !== this.user.data?.vehicle?.brand ||
          value.model !== this.user.data?.vehicle?.model ||
          value.licensePlate !== this.user.data?.vehicle?.licensePlate ||
          value.color !== this.user.data?.vehicle?.color ||
          value.capacity !== this.user.data?.vehicle?.capacity;
      })
    }
  }

  private fullNameValidator(control) {
    const value = control.value;
    if (!value) return;
    const names = value.split(' ') as string[];

    if (names.length < 2) {
      return { invalidFullName: true };
    }

    if (!names.every((name) => name.length > 3)) {
      return { invalidFullName: true };
    }

    // Regular expression to check if the full name contains numbers
    const hasNumbers = /\d/.test(value);

    if (hasNumbers) {
      return { fullNameContainsNumbers: true };
    }

    return null;
  }

  private colombianPhoneNumberValidator(control) {
    const phoneNumber = control.value;

    // Regular expression for a Colombian phone number
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      return { invalidPhoneNumber: true };
    }

    return null;
  }

  private emailValidator(control) {
    const email = control.value;

    // Regular expression for a simple email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(email)) {
      return { invalidEmail: true };
    }

    return null;
  }

  private licensePlateValidator(control) {
    const licensePlate = control.value;

    // Regular expression for a Colombian license plate
    const licensePlateRegex = /^[A-Z]{3}-\d{2,3}[A-Z]$/;

    if (!licensePlateRegex.test(licensePlate)) {
      return { invalidLicensePlate: true };
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
