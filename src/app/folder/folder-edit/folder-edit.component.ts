import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
    this.initForm();
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
      'name': new FormControl(folderName)
      // 'name': new FormControl(folderName, Validators.required) // if you want to add validators, this is the syntax
    });

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
