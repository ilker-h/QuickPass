import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataStorageInDBService } from './data-storage-in-db.service';

@Injectable()
export class AuthService {
    token: string;
    isSignUpSuccessful: boolean;
    errorMessage: string;

    constructor(private router: Router, private dataStorageInDBService: DataStorageInDBService) { }

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then (
                (response) => {
                    // this area only runs if the new user creation was successful
                    if (response.additionalUserInfo.isNewUser === true) {
                        this.isSignUpSuccessful = true;
                        console.log(this.isSignUpSuccessful);
                        console.log(response.additionalUserInfo.isNewUser);
                    }

                    console.log('trueeee: ' + JSON.stringify(response.additionalUserInfo.isNewUser));
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                    // alert(error);
                        this.isSignUpSuccessful = false;
                        console.log('falseeee');
                        this.errorMessage = error.message;
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
            ) .catch(
                (error) => {
                    console.log(error);
                    alert(error);
                }
            );
    }

    logoutUser() {
        firebase.auth().signOut();
        this.token = null; // reset the token
        this.router.navigate(['/login']);
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
