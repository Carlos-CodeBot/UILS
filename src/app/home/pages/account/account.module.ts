import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AccountPage } from "./account.page";
import { SharedModule } from "src/app/shared/shared.module";
import { AccountRoutingModule } from "./account-routing.module";
import { EditAccountPage } from './pages/edit-account/edit-account.page';
import { SelectComponent } from "src/app/shared/standalone-components/select/select.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        SharedModule,
        AccountRoutingModule,
        SelectComponent,
    ],
    declarations: [AccountPage, EditAccountPage],
})
export class AccountModule { }
