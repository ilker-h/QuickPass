import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    token: string;

    constructor(private router: Router) { }

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(
                (error) => {
                    console.log(error);
                    alert(error);
                }

            );
    }

    loginUser(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                (response) => {
                    this.router.navigate(['/items']); // this only redirects the user if the token was successful

                    console.log(response);
                    firebase.auth().currentUser.getIdToken()
                        .then(
                            (token: string) => this.token = token
                        );
                }
            ).catch(
                (error) => {
                    console.log(error);
                    alert(error);
                }
            );
    }

    logoutUser() {
        firebase.auth().signOut();
        this.token = null; // reset the token
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

}
