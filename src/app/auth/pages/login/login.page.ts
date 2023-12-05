import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { ON_WEB } from '../../../constants/platform';
import { LoadingController, NavController, ViewWillEnter, ViewWillLeave, iosTransitionAnimation } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillEnter, ViewWillLeave {
  public showPassword = false;
  public keyboardShow = false;
  form: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private auth: AuthService,
    private snackbar: SnackbarService,
    private router: NavController
  ) {
  }

  ngOnInit() {
    if (ON_WEB) return;
    Keyboard.addListener('keyboardWillShow', () => {
      this.keyboardShow = true;
      this.cdr.detectChanges();
    });
    Keyboard.addListener('keyboardWillHide', () => {
      this.keyboardShow = false;
      this.cdr.detectChanges();
    });
  }

  ionViewWillEnter() {
    this.buildForm();
  }

  async ionViewWillLeave() {
    if (ON_WEB) return;

    Keyboard.removeAllListeners();
  }

  async login() {
    if (
      this.form.invalid &&
      !this.form.controls.user.hasError('login') &&
      !this.form.controls.password.hasError('login')
    ) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    const loading = await this.createLoadingSpinner();

    loading.present();

    this.auth.login({
      username: this.form.value.user,
      password: this.form.value.password,
    }).subscribe({
      next: (res) => {
        if (!res) return;

        loading.dismiss();

        localStorage.setItem('authToken', res.token);
        this.router.navigateForward('');
      },
      error: (err) => {
        if (err.status === 403 || err.status === 400) {
          this.snackbar.show({
            message: 'Usuario o contraseña incorrectos',
            type: 'error',
          });
          this.form.controls.user.setErrors({ login: true });
          this.form.controls.password.setErrors({ login: true });
        }
        loading.dismiss();
      },
    })
  }

  /**
   * Método para construir el formulario del login
   */
  buildForm() {
    this.form = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  goBack() {
    this.router.back({ animation: iosTransitionAnimation });
  }

  /**
   * Método para moverse a través de los elementos mediante atajos de teclado
   *
   * @param keycode identificador de la tecla presionada
   * @param nextElement siguiente elemento
   */
  nextFocus(event: KeyboardEvent, nextElement) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      if (nextElement == null) {
        this.login();
      } else {
        nextElement.setFocus();
      }
    }
  }

  /**
   * Método para crear el spinner de carga
   *
   * @returns loading element
   */
  private async createLoadingSpinner() {
    const loading = await this.loadingController.create({
      backdropDismiss: false,
      message: '',
      cssClass: 'loading--empty',
    });
    return loading;
  }

}