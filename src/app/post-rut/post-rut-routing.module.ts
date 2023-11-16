import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostRutPage } from './post-rut.page';

const routes: Routes = [
  {
    path: '',
    component: PostRutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRutPageRoutingModule {}
