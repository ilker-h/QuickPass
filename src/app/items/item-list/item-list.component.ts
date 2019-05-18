import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

import { Item } from '../../shared/item.model';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { SearchService } from 'src/app/header/search.service';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Folder } from 'src/app/shared/folder.model';
import { FolderService } from 'src/app/folder/folder.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageInDBService } from 'src/app/auth/data-storage-in-db.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items: Item[]; // turn this into allItems?
  subscription: Subscription;
  itemSearchQuery: string; // for Search Query functionality
  allFolders: Folder[];
  itemForm: FormGroup;

  // for the table
  displayedColumns: string[] = ['select', 'title', 'username'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemService: ItemService, private folderService: FolderService,
    private router: Router, private route: ActivatedRoute,
    private typedItemSearchQuery: SearchService, private dataStorageInDBService: DataStorageInDBService,
    private httpClient: HttpClient) { }

  ngOnInit() {

    this.initializeFirebaseDBAndFrontendTables();

    // this subscribes to the itemsChanged observable and so it knows whenever the items array has
    // been updated. Then it updates the template with the newly updated item values
    this.subscription = this.itemService.itemsChanged
      .subscribe(
        (items: Item[]) => {
          // if the table values have been changed, do these things
          this.items = items;
          this.setupTable();
          this.initForm();

          // for populating the "Move to Folder" dropdown in the toolbar in the template
          // and for population the "Filter by Folder" dropdown in the template
          this.allFolders = this.folderService.getFolders(); // *** should I also put this outside of the subscribe?
        }
      );
    // if the table values have been not been changed, do these things that are outside of the subscribe()
    this.items = this.itemService.getItems();
    this.setupTable();
    this.initForm();

    // for Search Query functionality (should be inside ngOnInit)
    this.typedItemSearchQuery.currentItemSearchQuery
      .subscribe(itemSearchQuery => this.dataSource.filter = itemSearchQuery.trim().toLowerCase());

  }



  initializeFirebaseDBAndFrontendTables() {

    let userID = firebase.auth().currentUser.uid;

    // the purpose of GET here is to just check if that user's node on the DB exists or not (if not, it returns null)
    this.httpClient.get('https://quickpass-4ed21.firebaseio.com/' + userID + '.json')
      .pipe(map(
        (response) => {
          console.log('items worked???? ' + JSON.stringify(response));
          return response;
        }
      ))
      .subscribe(
        (response: Response) => {
          console.log(JSON.stringify(response) + 'error?????????????');

          if (response === null) {

            // if this user doesn't already have their own node on the Firebase DB (based on their UID),
            // then push the items array and folders array (which have one value hardcoded into each of them)
            // (stored in item.service.ts and folder.service.ts) to the DB in order to create a node for them
            // (and you need at least one value stored at that node or else it gets auto-deleted). This process
            // should only happen the very first time that the user logs in. The reason this is done is that before
            // this, the DB has nothing at that user's UID so it doesn't know how to separate each user's data
            // from other users' data (meaning anyone who's logged into any account sees the same data)

            this.dataStorageInDBService.PUTItemsIntoDB()
            .subscribe(
              response => { 
                console.log(response);
                      // gets the items data from the Firebase DB
            this.dataStorageInDBService.GETItemsFromDB();
              }
            );
          this.dataStorageInDBService.PUTFoldersIntoDB()
            .subscribe(
              response => {
                console.log(response);
                    // gets the folders data from the Firebase DB
                this.dataStorageInDBService.GETFoldersFromDB();}
            );

            // console.log(userUID + '3333333');
            this.router.navigate(['/items']);
            console.log(false);

          } else {
            // if this User's node exists on the Firebase DB already, then
            // get their data from the DB and put it into the items array and folders array
            this.dataStorageInDBService.GETItemsFromDB();
            this.dataStorageInDBService.GETFoldersFromDB();
            console.log(this.itemService.getItems());
            console.log(true);

          }
          console.log(this.itemService.getItems());
        }
      );

  }

  // this method is currently unused but I'm keeping it for the syntax:
  // onNewItem() {
  //   this.router.navigate(['/', 'new']); // using ['../new'] also works but I think this other one is better
  //   // this.router.navigate(['new'], {relativeTo: this.route});  <== it used to be this but I changed it
  // }

  selection; // for checkboxes

  setupTable() {
    this.dataSource = new MatTableDataSource<Item>(this.items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selection = new SelectionModel<Item>(true, []); // for checkboxes
  }

  // The built-in Javascript .map() function lets you convert this.folders,
  // which is an array of JSON objects,
  // to an array of properties. So it turns [{num: '1'}, {num: '2'}] to ['1', '2'].
  // The .indexOf(), or .findIndex(), then lets you find out the index of that property.
  // The solution is on https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties 
  findIndexOfItemTitle(itemTitle: string) {

    return this.items.map(

      (obj) => { return obj.title }

    ).indexOf(itemTitle)

  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log(this.selection); // this is useful for getting the values of the checkboxes
    // console.log(this.selection.selected); // this is useful for getting the values of the checkboxes
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

    console.log(this.selection.hasValue());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Item): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }


  private initForm() {
    let itemFolderMatchedTo;

    // this FormGroup goes into the template
    this.itemForm = new FormGroup({
      // these are from ItemService
      'folderMatchedTo': new FormControl(itemFolderMatchedTo),
      'All': new FormControl() // I don't know if this is being used
    })

  }

  folderNameToFilterBy;
  allItems;
  indicesOfArraysThatContainFolderNameToFilterBy: number[] = [];
  itemsInFolderNameToFilterBy: Item[] = [];
  onFilterByFolder() {

    if (this.itemForm.value['folderMatchedTo'] === 'All') {
      this.setupTable();

    } else {

      // initialize arrays
      this.indicesOfArraysThatContainFolderNameToFilterBy = [];
      this.itemsInFolderNameToFilterBy = [];


      // stores the dropdown Folder Name that was selected
      this.folderNameToFilterBy = this.itemForm.value['folderMatchedTo'];

      // get all items in the form of an array of objects then map() it into an array of arrays
      // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
      // so it turns from [{folderMatchedTo: "folder1"}, {folderMatchedTo: "folder2"}] to ["folder1", "folder2"]
      this.allItems = this.itemService.getItems().map(
        (obj) => { return obj.folderMatchedTo }
      );

      // Gets all indices of the values in an array
      // https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array
      for (let i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i] === this.folderNameToFilterBy) {
          this.indicesOfArraysThatContainFolderNameToFilterBy.push(i);
        }
      }

      // convert indices to an array of only Items that reside in the Folder that was selected
      for (let i of this.indicesOfArraysThatContainFolderNameToFilterBy) {
        this.itemsInFolderNameToFilterBy.push(this.itemService.getItem(i));
      }

      // fill up the table with Items that reside in the Folder that was selected
      this.dataSource = new MatTableDataSource<Item>(this.itemsInFolderNameToFilterBy);
      this.router.navigate(['/items']);

    }

    // Also, fix the name duplications of the forms like "folderMatchedTo" and clean up this file in general
  }

  stringArrayOfItemsToMoveToFolder;
  folderNameToMoveTo;
  onMoveToFolder() {

    // this.selection (and this.selection.selected) are useful because it returns an array of objects
    // that represents what checkboxes have been selected.
    // Then, using .map() on that array of objects turns it into a string array of title properties.
    // so it turns from [{title: "folder1"}, {title: "folder2"}] to ["folder1", "folder2"]
    // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
    this.stringArrayOfItemsToMoveToFolder = this.selection.selected.map((obj) => { return obj.title });

    this.folderNameToMoveTo = this.itemForm.value['folderMatchedTo'];

    // this loops through the string array of title properties
    for (let i of this.stringArrayOfItemsToMoveToFolder) {
      // this finds the index number of that specific title, and then deletes it
      this.itemService.updateItemFolder(this.findIndexOfItemTitle(i), this.folderNameToMoveTo);
    }
    this.router.navigate(['/items']);

  }

  stringArrayOfItemsToDelete;
  onDeleteItems() {

    // this.selection (and this.selection.selected) are useful because it returns an array of objects
    // that represents what checkboxes have been selected.
    // Then, using .map() on that array of objects turns it into a string array of title properties.
    // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
    this.stringArrayOfItemsToDelete = this.selection.selected.map((obj) => { return obj.title });

    // this loops through the string array of title properties
    for (let i of this.stringArrayOfItemsToDelete) {
      // this finds the index number of that specific title, and then deletes it
      this.itemService.deleteItem(this.findIndexOfItemTitle(i));
    }

    // Problem: If after this deletion, there are 0 items in the "folders" array in folder.service.ts,
    // then the array becomes automatically deleted and therefore, null (which causes errors all over the place).
    // Solution: I created this conditional statement so that there is always at least 1 item in
    //  the array so it can never become deleted and therefore, null.
    if (    this.itemService.getItems() === null ||
    this.itemService.getItems() === undefined || 
    this.itemService.getItems().length === 0
    ) { 
      this.itemService.addItem(new Item('Example GitHub Account', 'john-doe', 'john-github_564', 'john-doe@gmail.com', 
      'https://accounts.google.com/login?hl=en', 'Only for business use', 'Example Folder'));
    }

    this.router.navigate(['/items']);

    this.dataStorageInDBService.PUTItemsIntoDB()
    .subscribe(
      response => console.log(response)
    );
  }

  ngOnDestroy() {
    // unsubscribes in order to avoid memory leaks
    this.subscription.unsubscribe();
  }



}
