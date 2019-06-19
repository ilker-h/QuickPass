import { Component, OnInit } from '@angular/core';

import { DataStorageInDBService } from '../auth/data-storage-in-db.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public areYouSure = false;

  constructor(private dataStorageInDBService: DataStorageInDBService, private authService: AuthService) { }


  public ngOnInit() {
  }


  public onDeleteAccount() {
    this.areYouSure = true;
  }


  public onDeleteAccountYesIAmSure() {
    this.dataStorageInDBService.DELETEAllOfThisUsersDataFromDB();
    this.authService.deleteAccount();
    this.authService.logoutUser();
  }


  public getEmailOfLoggedInUser() {
    return this.authService.emailOfLoggedInUser;
  }

}
