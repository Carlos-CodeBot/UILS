import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Subject, Subscription, interval, startWith, switchMap, take, takeUntil } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';
import { TripChat, TripsService } from 'src/app/services/trips.service';
import { UserService } from 'src/app/services/user.service';
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
  chat: TripChat;
  chatSub: Subscription;
  constructor(
    private header: HeaderService,
    private trip: TripsService,
    private navbar: NavbarService,
    private snackbar: SnackbarService,
    public user: UserService
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
      sendAction: () => this.sendMessage(),
    };

    if (!this.trip.currTrip) {
      if (!localStorage.getItem('trip')) {
        this.chat = null;
      }
      this.trip.currTrip$.pipe(take(1)).subscribe((trip) => {
        if (!trip) {
          this.chat = null;
        } else {
          this.concurrentGetChat();
        }
      })
    } else {
      this.concurrentGetChat();
    }
  }

  sendMessage() {
    const value = this.control.value
    if (!value) return;

    this.control.disable();
    this.trip.sendMessageChat(
      this.trip.currTrip.id,
      value
    ).subscribe({
      next: (res) => {
        this.control.enable();
        if (!res) return;

        this.control.reset();
        this.chat.messages.push({
          id: 5,
          message: value,
          senderId: this.user.data.id,
          senderName: this.user.data.fullName,
          time: new Date().toString(),
        });
      },
      error: (err) => {
        this.control.enable();
        this.snackbar.showBackError(err);
      },
    })
  }

  concurrentGetChat() {
    let count = 0;
    this.chatSub = interval( 30 * 1000) // 30s in ms
      .pipe(
        startWith(0), // Emit 0 immediately
        switchMap(() => this.trip.getChat(this.trip.currTrip?.id, count > 0)),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res) => {
          count++;
          if (!res) {
            this.chat = null;
            return;
          };

          this.chat = res;
          if (this.control.disabled) {
            this.control.enable();
          }
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
