import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './pages/login/login.page';
import { SignupPage } from './pages/signup/signup.page';
import { AuthPage } from './auth.page';
import { RegisterVehiclePage } from './pages/signup/pages/register-vehicle/register-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: 'register-vehicle',
    component: RegisterVehiclePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AuthRoutingModule { }
