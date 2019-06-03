import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { FolderService } from 'src/app/folder/folder.service';
import { DataStorageInDBService } from 'src/app/auth/data-storage-in-db.service';

@Component({
  selector: 'app-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.css']
})
export class FolderEditComponent implements OnInit {

  id: number; // ID of the folder
  editMode = false; // differentiates between "edit" mode and "create new" mode
  folderForm: FormGroup;
  allFolders;

  constructor(private route: ActivatedRoute, private folderService: FolderService, private router: Router,
    private dataStorageInDBService: DataStorageInDBService) { }


  ngOnInit() {

    // subscribes to the route's "params" observable and then saves the id
    // (the "+" turns the string into a number)
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id']; // add "folder" to this?
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }


  onSubmit() {

    if (this.didTheUserEnterADuplicateFolderName()) {
      return;
    }

    // every Folder must have a filled-in Name field
    if (this.folderForm.value.name.trim() === '' || null || undefined) {
      alert('Error: You must fill in the "Folder Name" field.');
      return;

    } else {

      if (this.editMode) {
        // if you're editing an existing folder
        this.folderService.updateFolder(this.id, this.folderForm.value);

      } else {
        // if you're creating a new folder
        this.folderService.addFolder(this.folderForm.value);
        this.router.navigate(['/folders']);

      }

      // now that the edit(s) has happened in the local array,
      // this pushes the updated local array of data to the remote Firebase DB
      this.dataStorageInDBService.PUTFoldersIntoDB()
        .subscribe(
          // response => console.log(response)
        );

    }

  }


  onDelete() {
    this.folderService.deleteFolder(this.id);
    this.router.navigate(['/folders']);

    // now that the deletion(s) has happened in the local array,
    // this pushes the updated local array of data to the remote Firebase DB
    this.dataStorageInDBService.PUTFoldersIntoDB()
      .subscribe(
        // response => console.log(response)
      );
  }


  onCancel() {
    if (this.editMode === true) {
      this.initForm();
    } else {
      this.router.navigate(['/folders']);
    }
  }


  private initForm() {

    let folderName = '';

    if (this.editMode) {
      // this is from FolderService
      const folder = this.folderService.getFolder(this.id);
      folderName = folder.name;
    }

    // this FormGroup goes into the template
    this.folderForm = new FormGroup({
      'name': new FormControl(folderName, Validators.required)
      // 'name': new FormControl(folderName, Validators.required) // if you want to add validators, this is the syntax
    });

  }


  // Note: I think I can simplify this code because it's a little repetitive
  didTheUserEnterADuplicateFolderName() {

    // If you're in edit mode, there can be 1 duplicate folder name (which is the folder you're currently on).
    // If you're not in edit mode (like when creating a new folder), there can be no folder name duplicates.
    if (this.editMode) {
      // get all folders in the form of an array of objects then map() it into an array of values (of type string)
      // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
      // so it turns from [{folderMatchedTo: "folder1"}, {folderMatchedTo: "folder2"}] to ["folder1", "folder2"]
      this.allFolders = this.folderService.getFolders().map(
        (obj) => { return obj.name; }
      );

      let numberOfDuplicates = 0;
      // Checks if the folder name that was inputted is the same as a previously existing folder name,
      // because there should be no two identical folder names
      for (let i = 0; i < this.allFolders.length; i++) {
        if ( ( this.allFolders[i].trim() === this.folderForm.value.name.trim() )  && (i !== this.id) ) {
          numberOfDuplicates++;
        }
      }

      if (numberOfDuplicates > 0) {
        alert('Error: The "Folder Name" you entered already exists. Please enter a unique "Folder Name".');
        return true;
      }

    } else {
      // get all folders in the form of an array of objects then map() it into an array of values (of type string)
      // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
      // so it turns from [{folderMatchedTo: "folder1"}, {folderMatchedTo: "folder2"}] to ["folder1", "folder2"]
      this.allFolders = this.folderService.getFolders().map(
        (obj) => { return obj.name; }
      );

      let numberOfDuplicates = 0;
      // Checks if the folder name that was inputted is the same as a previously existing folder name,
      // because there should be no two identical folder names
      for (let i = 0; i < this.allFolders.length; i++) {
        if (this.allFolders[i].trim() === this.folderForm.value.name.trim()) {
          numberOfDuplicates++;
        }
      }

      if (numberOfDuplicates > 0) {
        alert('Error: The "Folder Name" you entered already exists. Please enter a unique "Folder Name".');
        return true;
      }

    }

  }

  // I'm keeping this for the syntax:
  // this.router.navigate(['../'], {relativeTo: this.route});


  // // Note, alternate solution:
  // // to check if a URL includes a certain ID, instead of doing router.url.includes('folders'),
  // // this also seems to work and is what Max did in "Lecture 65. Creating the "edit" Form":

  // // paramMap is an observable
  // this.route.paramMap.subscribe(
  //   (paramMap: ParamMap) => {
  //     // checks if the URL has "folders" in it
  //     if (paramMap.has('folders')) {

  //     }
  // });

}
