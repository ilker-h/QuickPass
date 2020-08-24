import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { FolderService } from '../folder/folder.service';
import { Folder } from '../folder/folder.model';
import { ItemService } from '../item/item.service';
import { Item } from '../item/item.model';

@Injectable()
export class DataStorageInDBService {
  private DATABASE_URL = environment.firebase.databaseURL;

  constructor(private httpClient: HttpClient, private itemService: ItemService, private folderService: FolderService) { }

  // _____________________________ Item Communication with Firebase DB _____________________________

  // Note, common error: This HTTP PUT method creates an observable that must be subscribed to before it can send data.
  // This is because Angular knows that if you haven't subscribed to it to listen to the response,
  // there's no point of sending out a request because its response won't be heard anyway. So wherever I call
  //     this.dataStorageInDBService.PUTItemsIntoDB(), I must also apply something like
  //  .subscribe( response => console.log(response) ) on it. (But no need to unsubscribe from it because
  // angular takes care of that for us in these pre-built cases like with HTTP GET).
  public PUTItemsIntoDB() {

    // getting the current user's id/"User UID",
    // from https://stackoverflow.com/questions/30910704/how-do-i-link-each-user-to-their-data-in-firebase
    let userID = firebase.auth().currentUser.uid;

    return this.httpClient.put(this.DATABASE_URL + '/' + userID + '/items.json', this.itemService.getItems());
  }


  // by default, the get() method returns the body of the response. If you want another part of the
  // response, like the header, you'd have to configure it more.
  // Also, the get() method already turns the JSON into JavaScript so you don't need to do .json() to transform it anymore
  public GETItemsFromDB() {

    // getting the current user's id/"User UID",
    // from https://stackoverflow.com/questions/30910704/how-do-i-link-each-user-to-their-data-in-firebase
    let userID = firebase.auth().currentUser.uid;

    this.httpClient.get<Item[]>(this.DATABASE_URL + '/' + userID + '/items.json')
      .pipe(map(
        // .map() operator transforms the JSON string you get back to whatever you want.
        // However, after an RxJS update, you now have to do .pipe(map(___)) to do the same thing.
        // I'm not sure if I need .pipe(map(___)) anymore though
        // from https://www.udemy.com/the-complete-guide-to-angular-2/learn/lecture/6656640#questions
        // (lecture 260. Transforming Response Data to Prevent Errors)
        // and https://www.udemy.com/the-complete-guide-to-angular-2/learn/lecture/5402690#questions
        // (lecture 253. Catching Errors without rxjs-compat)
        (items) => {
          return items;
        }
      ))
      .subscribe(
        (items: Item[]) => {
          this.itemService.setItems(items);
        }
      );
  }



  // _____________________________ Folder Communication with Firebase DB _____________________________

  // Note, common error: This HTTP PUT method creates an observable that must be subscribed to before it can send data.
  // This is because Angular knows that if you haven't subscribed to it to listen to the response,
  // there's no point of sending out a request because its response won't be heard anyway. So wherever I call
  //     this.dataStorageInDBService.PUTFoldersIntoDB(), I must also apply something like
  //  .subscribe( response => console.log(response) ) on it. (But no need to unsubscribe from it because
  // angular takes care of that for us in these pre-built cases like with HTTP GET).
  public PUTFoldersIntoDB() {

    // getting the current user's id/"User UID",
    // from https://stackoverflow.com/questions/30910704/how-do-i-link-each-user-to-their-data-in-firebase
    let userID = firebase.auth().currentUser.uid;

    return this.httpClient.put(this.DATABASE_URL + '/' + userID + '/folders.json', this.folderService.getFolders());
  }


  // by default, the get() method returns the body of the response. If you want another part of the
  // response, like the header, you'd have to configure it more.
  // Also, the get() method already turns the JSON into JavaScript so you don't need to do .json() to transform it anymore
  public GETFoldersFromDB() {

    // getting the current user's id/"User UID",
    // from https://stackoverflow.com/questions/30910704/how-do-i-link-each-user-to-their-data-in-firebase
    let userID = firebase.auth().currentUser.uid;

    this.httpClient.get<Folder[]>(this.DATABASE_URL + '/' + userID + '/folders.json')
      .pipe(map(
        // .map() operator transforms the JSON string you get back to whatever you want.
        // However, after an RxJS update, you now have to do .pipe(map(___)) to do the same thing.
        // I'm not sure if I need .pipe(map(___)) anymore though
        // from https://www.udemy.com/the-complete-guide-to-angular-2/learn/lecture/6656640#questions
        // (lecture 260. Transforming Response Data to Prevent Errors)
        // and https://www.udemy.com/the-complete-guide-to-angular-2/learn/lecture/5402690#questions
        // (lecture 253. Catching Errors without rxjs-compat)
        (response) => {

          let folders: Folder[] = response;
          if (!folders) {
            folders = [];
          }

          for (let folder of folders) {
            if (!folder['name']) {
              folder['name'] = '';
            }
          }
          return response;
        }
      ))
      .subscribe(
        (folders: Folder[]) => {
          this.folderService.setFolders(folders);
        }
      );
  }



  // _____________________________ Delete the user's entire node (and the data nested in it) from Firebase DB ____________________________


  public DELETEAllOfThisUsersDataFromDB() {
    // getting the current user's id/"User UID",
    // from https://stackoverflow.com/questions/30910704/how-do-i-link-each-user-to-their-data-in-firebase
    let userID = firebase.auth().currentUser.uid;


    this.httpClient.delete(this.DATABASE_URL + '/' + userID + '.json')
      .subscribe(
        (response) => {
        }
      );
  }

}
