import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  numberOfCases = 6;
  readyCases = 5;
  requireActionCases = 0;
  inProgressCases = 1;
  noActionCases = 0;

  notificationText = 'This text will appear inside the notification';
  notificationTitle = 'Notification title';

  // Provide UI updates about what's happening (usually JSON objects)
  notificationStatus: Object;
  subscriptionStatus: Object;

  // Controls what options are shown or hidden on the UI
  hasNotificationErrors = false;
  hasSubscriptionErrors = false;
  readyToSend = false;

  clientIdentifier: Number;

  constructor(private http: HttpClient, private swPush: SwPush) { }

  ngOnInit() {
    this.subscribeToNotifications();

    this.swPush.messages.subscribe(
      data => {
        this.hasSubscriptionErrors = false;
        this.handleNotificationData(data);
      },
      error => {
        this.hasSubscriptionErrors = true;
        this.subscriptionStatus = 'Notifications are allowed but subscription was not sent to the service.';
      }
    );
  }

  subscribeToNotifications() {
    this.subscriptionStatus = 'Requesting notification subscription...';

    this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey
    })
    .then(sub => this.addPushSubscriber(sub).subscribe(
      data => {
        this.clientIdentifier = parseInt(data.toLocaleString(), 10);
        this.hasSubscriptionErrors = false;
        this.readyToSend = true;
        this.subscriptionStatus = 'Notifications are allowed and subscription was sent to the service.';
      },
      error => {
        this.hasSubscriptionErrors = true;
        this.subscriptionStatus = 'Notifications are allowed but subscription was not sent to the service.';

      }
    ))
    .catch(err => {
      this.hasSubscriptionErrors = true;
      this.subscriptionStatus = 'Notifications have been disabled.';
    });
  }

  addPushSubscriber(sub: PushSubscription) {
    this.subscriptionStatus = 'Notifications are allowed...';
    return this.http.post(environment.registerSubscriberEndpoint, sub);
  }

  handleNotificationData(rawData: any): void {
    if (rawData.notification && rawData.notification.data) {
      const notificationData = rawData.notification.data;
      this.numberOfCases = notificationData.numberOfCases ? notificationData.numberOfCases : this.numberOfCases;
      this.readyCases = notificationData.readyCases ? notificationData.readyCases : this.readyCases;
      this.requireActionCases = notificationData.requireActionCases ? notificationData.requireActionCases : this.requireActionCases;
      this.inProgressCases = notificationData.inProgressCases ? notificationData.inProgressCases : this.inProgressCases;
      this.noActionCases = notificationData.noActionCases ? notificationData.noActionCases : this.noActionCases;
    }
  }

  sendNotification(): void {
    this.notificationStatus = 'Sending request...';
    this.hasNotificationErrors = false;

    this.http.post(
      environment.sendNotificationEndpoint,
      {
        clientIdentifier: this.clientIdentifier,
        title: this.notificationTitle.length > 0 ? this.notificationTitle : null,
        body: this.notificationText.length > 0 ? this.notificationText : null
      }).subscribe(
      data => {
        this.notificationStatus = data;
        this.hasNotificationErrors = false;
      },
      error => {
        this.notificationStatus = error;
        this.hasNotificationErrors = true;
        return Observable.throw(error);
      }
    );
  }
}
