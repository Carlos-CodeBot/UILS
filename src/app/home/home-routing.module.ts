import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home.component';
import { ChatPage } from './pages/chat/chat.page';
import { MapPage } from './pages/map/map.page';
import { WrapperComponent } from './components/wrapper/wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: WrapperComponent,
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            component: HomePage,
            canActivate: [AuthGuard],
          },
          {
            path: 'chat',
            component: ChatPage,
            canActivate: [AuthGuard],
          },
          {
            path: 'account',
            loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
            canActivate: [AuthGuard],
          },
          {
            path: 'map',
            component: MapPage,
            canActivate: [AuthGuard],
          },
          {
            path: '**',
            redirectTo: '',
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
