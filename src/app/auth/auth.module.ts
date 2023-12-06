import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginPage } from './pages/login/login.page';
import { SignupPage } from './pages/signup/signup.page';
import { HttpClientModule } from '@angular/common/http';
import { AuthPage } from './auth.page';
import { RegisterVehiclePage } from './pages/signup/pages/register-vehicle/register-vehicle.page';
import { SelectComponent } from '../shared/standalone-components/select/select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SelectComponent,
  ],
  declarations: [AuthPage, LoginPage, SignupPage, RegisterVehiclePage]
})
export class AuthModule { }
