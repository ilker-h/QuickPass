import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import * as firebase from 'firebase';

@Injectable()
export class AuthService {
    token: string;
    isSignUpSuccessful: boolean;
    signUpErrorMessage: string;
    logInErrorMessage: string;

    constructor(private router: Router, private titleService: Title) { }

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                (response) => {
                    // this area only runs if the new user creation was successful
                    if (response.additionalUserInfo.isNewUser === true) {
                        this.isSignUpSuccessful = true;
                    }
                    // console.log(JSON.stringify(response.additionalUserInfo.isNewUser));
                }
            )
            .catch(
                (error) => {
                    // alert(error);
                    this.isSignUpSuccessful = false;
                    this.signUpErrorMessage = error.message;
                }
            );
    }


    loginUser(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                (response) => {
                    this.router.navigate(['/items']); // this only redirects the user if the token was successful
                    this.setTitle('QuickPass | Passwords');

                    firebase.auth().currentUser.getIdToken()
                        .then(
                            (token: string) => this.token = token
                        );
                }
            ).catch(
                (error) => {
                    // alert(error);
                    this.logInErrorMessage = error.message;

                }
            );
    }

    logoutUser() {
        firebase.auth().signOut();
        this.token = null; // reset the token
        this.router.navigate(['/login']);
        this.setTitle('QuickPass | Log In');
    }

    getToken() {
        firebase.auth().currentUser.getIdToken()
            .then(
                (token: string) => this.token = token
            );
        return this.token;
    }

    isAuthenticated() {
        // Checks if the token is valid/not expired, meaning you're authenticated.
        // Returns true if the token is valid.
        return this.token != null;
    }

    deleteAccount() {
        firebase.auth().currentUser.delete()
            .catch(error => { })
            .then(() => alert('Your account was successfully deleted.'));
    }

    // For changing the DOM's title (the one shown in a browser tab),
    // originally from the index.html file's <head> tag.
    // Documentation: https://angular.io/guide/set-document-title
    private setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

}
