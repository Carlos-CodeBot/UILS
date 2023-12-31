import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './pages/home/home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HomeDriverPage } from './pages/home-driver/home-driver.page';
import { HomeComponent } from './home.component';
import { ChatPage } from './pages/chat/chat.page';
import { MapPage } from './pages/map/map.page';
import { SharedModule } from '../shared/shared.module';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { PublishRoutePage } from './pages/home-driver/pages/publish-route/publish-route.page';
import { SelectComponent } from '../shared/standalone-components/select/select.component';
import { ModalViewTripComponent } from './pages/map/components/modal-view-trip.component';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SelectComponent,
    PipesModule
  ],
  declarations: [HomeComponent, HomePage, HomeDriverPage, ChatPage, MapPage, WrapperComponent, PublishRoutePage, ModalViewTripComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
