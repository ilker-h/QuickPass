import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ItemService } from '../item.service';
import { FolderService } from '../../folder/folder.service';
import { Folder } from 'src/app/shared/folder.model';
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

          // if (this.route.params['new']) {
          //   this.hide = false;
          // }
        }
      );
  }

  onSubmit() {

    if (this.editMode) {
      //if you're editing an existing item
      this.itemService.updateItem(this.id, this.itemForm.value);
    } else {
      //if you're creating a new item
      this.itemService.addItem(this.itemForm.value)
      this.router.navigate(['/items']);
    }

    this.dataStorageInDBService.PUTItemsIntoDB()
    .subscribe(
      response => console.log(response)
    );

  }

  onDelete() {
    this.itemService.deleteItem(this.id);
    this.router.navigate(['/items']);

    this.dataStorageInDBService.PUTItemsIntoDB()
    .subscribe(
      response => console.log(response)
    );
  }

  onCancel() {
    // this.router.navigate(['../'], {relativeTo: this.route}); // I'm keeping this for syntax
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

    let folderName = '';

    if (this.editMode) {
      // these are from ItemService
      const item = this.itemService.getItem(this.id);
      itemTitle = item.title;
      itemUsername = item.username;
      itemPassword = item.password;
      itemEmail = item.email;
      itemUrl = item.url;
      itemNotes = item.notes;
      itemFolderMatchedTo = item.folderMatchedTo;

      // this is from FolderService - this doesn't make sense because the folder may not be at the same index as the item
      // this is from FolderService
      // const folder = this.folderService.getFolder(this.id);
      // folderName = folder.name;
    }

    // this FormGroup goes into the template
    this.itemForm = new FormGroup({
      // these are from ItemService
      'title': new FormControl(itemTitle, Validators.required),
      'username': new FormControl(itemUsername, Validators.required),
      'password': new FormControl(itemPassword, Validators.required),
      'email': new FormControl(itemEmail, Validators.required),
      'url': new FormControl(itemUrl, Validators.required),
      'notes': new FormControl(itemNotes, Validators.required),
      'folderMatchedTo': new FormControl(itemFolderMatchedTo, Validators.required),

      // this is the folder name from FolderService
      // 'name': new FormControl(folderName, Validators.required) // I don't think this is being used anymore
    })

  }
}
