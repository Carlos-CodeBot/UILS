import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Subject, Subscription, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';
import { TripsService } from 'src/app/services/trips.service';
import { HeaderService } from 'src/app/shared/components/header/service/header.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements ViewWillEnter, OnInit, ViewWillLeave, OnDestroy {
  private destroy$ = new Subject<void>(); // Subject to trigger the "takeUntil" condition
  control: FormControl;
  chat: any;
  chatSub: Subscription;
  constructor(
    private header: HeaderService,
    private trip: TripsService,
    private navbar: NavbarService,
    private snackbar: SnackbarService
  ) { }
  
  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    this.header.setTitle('Chat');
    this.header.setGoBack();
    this.control = new FormControl('');
    this.control.disable();
    this.navbar.input = {
      control: this.control,
      sendAction: () => {
        console.log('send');
      }
    };
    this.getChat();
    this.concurrentGetChat();
  }

  getChat() {
    if (!this.trip.currTrip?.id) {
      this.chat = null;
      return;
    }

    this.trip.getChat(this.trip.currTrip.id).subscribe({
      next: (res) => {
        if (!res) {
          this.chat = null;
          return;
        }
        this.control.enable();
        this.chat = res;
      },
      error: (err) => this.snackbar.showBackError(err),
    })
  }

  concurrentGetChat() {
    this.chatSub = interval(5 * 60 * 1000) // 5 minutes in ms
      .pipe(
        startWith(0), // Emit 0 immediately
        switchMap(() => this.trip.getChat(this.trip.currTrip.id)),
        takeUntil(this.destroy$)
      ).subscribe({
      next: (res) => {
        if (!res) {
          this.chat = null;
          return;
        };

        this.chat = res;
      },
      error: (err) => this.snackbar.showBackError(err),
    });
  }

  ionViewWillLeave(): void {
    this.navbar.input = null;
    this.chatSub?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Trigger the subject to stop emissions
    this.destroy$.complete(); // Complete the subject to release resources
    this.chatSub?.unsubscribe();
  }
}
