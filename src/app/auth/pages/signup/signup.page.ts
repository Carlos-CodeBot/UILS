import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSegment, NavController, ViewWillEnter, ViewWillLeave, iosTransitionAnimation } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements ViewWillEnter, ViewWillLeave{
  @ViewChild('roleSegment') segmentRef: IonSegment;
  showPassword = false;
  form: FormGroup
  constructor(
    private router: NavController,
    private fb: FormBuilder,
    private auth: AuthService,
    private snackbar: SnackbarService
  ) { }
  
  ionViewWillEnter() {
    this.buildForm();
  }

  ionViewWillLeave(): void {
  }

  goBack() {
    this.router.back({ animation: iosTransitionAnimation });
  }

  signup() {
    this.auth.signup({
      username: this.form.value.username,
      password: this.form.value.password,
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phoneNumber: this.form.value.phoneNumber,
      role: (this.segmentRef.value as 'passenger' || 'driver'),
    }).subscribe({
      next: (res) => {
        if (!res) return;

        localStorage.setItem('authToken', res.token);
        if (this.segmentRef.value === 'driver') {
          this.router.navigateForward('/auth/register-vehicle', {animation: iosTransitionAnimation})
        } else {
          this.router.navigateForward('');
        }
      },
      error: (err) => this.snackbar.showBackError(err),
    })
  }

  buildForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: ['', [Validators.required, this.fullNameValidator]],
      phoneNumber: [null, [Validators.required, this.colombianPhoneNumberValidator]],
      email: ['', [Validators.required, this.emailValidator]],
    });

    this.form.controls.username.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((username) => {
        this.auth.checkNameExists(username).subscribe({
          next: (res) => {
            if (res) {
              this.form.controls.username.setErrors({ userExists: true });
            } else if (this.form.controls.username.hasError('userExists')){
              this.form.controls.username.setErrors(null);
            }
          },
          error: (err) => {
            if (err.status === 400) {
              if (this.form.controls.username.hasError('userExists')) {
                this.form.controls.username.setErrors(null);
              }
            }
          }
        })
      })
  }

  private fullNameValidator(control) {
    const value = control.value;
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
}
