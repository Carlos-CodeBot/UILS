import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostRutPageRoutingModule } from './post-rut-routing.module';

import { PostRutPage } from './post-rut.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostRutPageRoutingModule
  ],
  declarations: [PostRutPage]
})
export class PostRutPageModule {}
