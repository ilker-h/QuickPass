import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase'; // import everything as 'firebase' alias

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'QuickPass';
  loadedFeature = 'item';


  ngOnInit() {
    // Configure and initialize Firebase SDK backend when app starts
    firebase.initializeApp({
      apiKey: 'AIzaSyBnVlBrTi_9bcJJi-uVcpcO0wFbINGSLa0',
      authDomain: 'quickpass-4ed21.firebaseapp.com',
      databaseURL: 'https://quickpass-4ed21.firebaseio.com',
      projectId: 'quickpass-4ed21',
      storageBucket: 'quickpass-4ed21.appspot.com',
      messagingSenderId: '969326079197'
    });
  }


  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}

