import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private titleService: Title) { }


  ngOnInit() {
  }


  onLogin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.loginUser(email, password);
  }


  // For changing the DOM's title (the one shown in a browser tab),
  // originally from the index.html file's <head> tag.
  // Documentation: https://angular.io/guide/set-document-title
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
