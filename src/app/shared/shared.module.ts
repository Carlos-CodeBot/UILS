import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DialogComponent } from './components/dialog/dialog.component';
import { AdDirective } from './components/dialog/directives/ad-component/ad-component.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
    declarations: [
        DialogComponent,
        HeaderComponent,
        AdDirective,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule,
        PipesModule
    ],
    exports: [
        HeaderComponent
    ]
})
export class SharedModule { }
