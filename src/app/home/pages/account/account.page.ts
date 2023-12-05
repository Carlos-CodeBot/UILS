import { Component } from '@angular/core';
import { NavController, ViewWillEnter, ViewWillLeave, iosTransitionAnimation } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';

@Component({
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements ViewWillEnter, ViewWillLeave {
  constructor(
    private auth: AuthService,
    private header: HeaderService,
    private router: NavController,
    private dialog: DialogService,
    public user: UserService
  ) { }
  
  ionViewWillEnter(): void {
    this.header.setTitle('Cuenta');
    this.header.removeGoBack();
    this.header.actions = {
      primary: {
        name: 'Cerrar sesión',
        icon: 'logout',
        action: () =>
          this.dialog.show({
            header: {
              title: 'Cerrar sesión',
              icon: 'error',
            },
            type: 'warning',
            content: '¿Estás seguro que quieres cerrar sesión?',
            actions: {
              primary: {
                name: 'Cerrar sesión',
                action: (dialogRef) => {
                  dialogRef.dismiss();
                  this.auth.logout();
                },
              },
              dismiss: {
                name: 'Cancelar',
              },
            },
          })
      },
    };
  }

  ionViewWillLeave(): void {
    this.header.actions = null;
  }

  goToEdit(type: 'user' | 'vehicle') {
    localStorage.setItem('tempEdit', type);
    this.router.navigateForward('/account/edit', { animation: iosTransitionAnimation });
  }
}
