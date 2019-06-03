import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { ItemService } from '../item.service';
import { FolderService } from '../../folder/folder.service';
import { Folder } from 'src/app/folder/folder.model';
import { DataStorageInDBService } from 'src/app/auth/data-storage-in-db.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {

  id: number; // ID of the item
  editMode = false; // differentiates between "edit" mode and "create new" mode
  itemForm: FormGroup;
  hide = true; // for masking the password
  allItems;
  allFolders: Folder[];

  constructor(private route: ActivatedRoute, private itemService: ItemService,
    private folderService: FolderService, private router: Router,
    private dataStorageInDBService: DataStorageInDBService) { }


  ngOnInit() {

    // for populating the Folder dropdown in the template
    this.allFolders = this.folderService.getFolders();

    // subscribes to the route's "params" observable and then saves the id
    // (the "+" turns the string into a number)
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }


  onSubmit() {

    if (this.didTheUserEnterADuplicateTitle()) {
      return;
    }

    // every Item must have a filled-in Title field
    if (this.itemForm.value.title.trim() === '' || null || undefined) {
      alert('Error: You must fill in the "Title" field.');
      return;

    } else {

      if (this.editMode) {
        // if you're editing an existing item
        this.itemService.updateItem(this.id, this.itemForm.value);

      } else {
        // if you're creating a new item
        this.itemService.addItem(this.itemForm.value);
        this.router.navigate(['/items']);

      }

      // now that the edit(s) has happened in the local array,
      // this pushes the updated local array of data to the remote Firebase DB
      this.dataStorageInDBService.PUTItemsIntoDB()
        .subscribe(
          // response => console.log(response)
        );

    }

  }


  onDelete() {
    this.itemService.deleteItem(this.id);
    this.router.navigate(['/items']);

    // now that the deletion(s) has happened in the local array,
    // this pushes the updated local array of data to the remote Firebase DB
    this.dataStorageInDBService.PUTItemsIntoDB()
      .subscribe(
        // response => console.log(response)
      );
  }


  onCancel() {
    if (this.editMode === true) {
      this.initForm();
    } else {
      this.router.navigate(['/items']);
    }
  }


  private initForm() {

    this.hide = true; // reinitializing the password masking feature

    let itemTitle = '';
    let itemUsername = '';
    let itemPassword = '';
    let itemEmail = '';
    let itemUrl = '';
    let itemNotes = '';
    let itemFolderMatchedTo = '';

    if (this.editMode) {
      const item = this.itemService.getItem(this.id);
      itemTitle = item.title;
      itemUsername = item.username;
      itemPassword = item.password;
      itemEmail = item.email;
      itemUrl = item.url;
      itemNotes = item.notes;
      itemFolderMatchedTo = item.folderMatchedTo;
    }

    // this FormGroup goes into the template
    this.itemForm = new FormGroup({
      // 'title': new FormControl(itemTitle, Validators.required),  // if you want to add validators, this is the syntax
      'title': new FormControl(itemTitle, Validators.required),
      'username': new FormControl(itemUsername),
      'password': new FormControl(itemPassword),
      'email': new FormControl(itemEmail),
      'url': new FormControl(itemUrl),
      'notes': new FormControl(itemNotes),
      'folderMatchedTo': new FormControl(itemFolderMatchedTo),
    });

  }


  // Note: I think I can simplify this code because it's a little repetitive
  didTheUserEnterADuplicateTitle() {

    // If you're in edit mode, there can be 1 duplicate title (which is the item you're currently on).
    // If you're not in edit mode (like when creating a new item), there can be no title duplicates.
    if (this.editMode) {
      // get all items in the form of an array of objects then map() it into an array of values (of type string)
      // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
      // so it turns from [{folderMatchedTo: "folder1"}, {folderMatchedTo: "folder2"}] to ["folder1", "folder2"]
      this.allItems = this.itemService.getItems().map(
        (obj) => { return obj.title; }
      );

      let numberOfDuplicates = 0;
      // Checks if the title that was inputted is the same as a previously existing title,
      // because there should be no two identical titles
      for (let i = 0; i < this.allItems.length; i++) {
        if ( ( this.allItems[i].trim() === this.itemForm.value.title.trim() ) && (i !== this.id) ) {
          numberOfDuplicates++;
        }
      }

      if (numberOfDuplicates > 0) {
        alert('Error: The "Title" you entered already exists. Please enter a unique "Title".');
        return true;
      }

    } else {
      // get all items in the form of an array of objects then map() it into an array of values (of type string)
      // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
      // so it turns from [{folderMatchedTo: "folder1"}, {folderMatchedTo: "folder2"}] to ["folder1", "folder2"]
      this.allItems = this.itemService.getItems().map(
        (obj) => { return obj.title; }
      );

      let numberOfDuplicates = 0;
      // Checks if the title that was inputted is the same as a previously existing title,
      // because there should be no two identical titles
      for (let i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].trim() === this.itemForm.value.title.trim()) {
          numberOfDuplicates++;
        }
      }

      if (numberOfDuplicates > 0) {
        alert('Error: The "Title" you entered already exists. Please enter a unique "Title".');
        return true;
      }

    }

  }

  // I'm keeping this for syntax
  // this.router.navigate(['../'], {relativeTo: this.route});
}
