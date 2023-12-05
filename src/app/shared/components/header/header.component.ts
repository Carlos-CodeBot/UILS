import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HeaderService } from './service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  @Output() goBack: EventEmitter<any> = new EventEmitter();

  userSub: Subscription;
  avatarSub: Subscription;
  menusSub: Subscription;
  actionsSub: Subscription;
  constructor(
    public router: Router,
    public menuController: MenuController,
    public headerService: HeaderService
  ) {
  }

  ngOnDestroy(): void {}
}
