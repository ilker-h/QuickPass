import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FolderService } from 'src/app/folder/folder.service';

@Component({
  selector: 'app-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.css']
})
export class FolderEditComponent implements OnInit {

  id: number; // ID of the folder
  editMode = false; // differentiates between "edit" mode and "create new" mode
  folderForm: FormGroup;

  constructor(private route: ActivatedRoute, private folderService: FolderService, private router: Router) { }

  ngOnInit() {

    // subscribes to the route's "params" observable and then saves the id 
    // (the "+" turns the string into a number)
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id']; // add "folder" to this?
          this.editMode = params['id'] != null;
          this.initForm()

          // if (this.route.params['new']) {
          //   this.hide = false;
          // }
          // console.log(this.allItems[params['id']].folder);
        }
      );
  }

  onSubmit() {

    if (this.editMode) {
      //if you're editing an existing folder
      this.folderService.updateFolder(this.id, this.folderForm.value);
    } else {
      //if you're creating a new folder
      this.folderService.addFolder(this.folderForm.value)
    }
  }

  onCancel() {
    // this.router.navigate(['../'], {relativeTo: this.route}); // I'm keeping this for the syntax
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
      // this is the folder name from FolderService
      'name': new FormControl(folderName, Validators.required)
    })

  }

}
