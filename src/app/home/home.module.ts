import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './pages/home/home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HomeDriverPage } from './pages/home-driver/home-driver.page';
import { HomeComponent } from './home.component';
import { ChatPage } from './pages/chat/chat.page';
import { MapPage } from './pages/map/map.page';
import { SharedModule } from '../shared/shared.module';
import { WrapperComponent } from './components/wrapper/wrapper.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [HomeComponent, HomePage, HomeDriverPage, ChatPage, MapPage, WrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
