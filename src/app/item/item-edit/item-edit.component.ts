import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
    this.initForm();
  }

  private initForm() {

    this.hide = true; // reinitializing the password masking feature

    let itemTitle = '';
    let itemUsername = '';
    let itemPassword = '';
    let itemEmail = '';
    let itemUrl = '';
    let itemNotes = '';
    let itemFolderMatchedTo;

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
      'title': new FormControl(itemTitle),
      'username': new FormControl(itemUsername),
      'password': new FormControl(itemPassword),
      'email': new FormControl(itemEmail),
      'url': new FormControl(itemUrl),
      'notes': new FormControl(itemNotes),
      'folderMatchedTo': new FormControl(itemFolderMatchedTo),
    });

  }

  // I'm keeping this for syntax
  // this.router.navigate(['../'], {relativeTo: this.route});
}