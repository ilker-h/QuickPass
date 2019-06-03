import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { Subscription } from 'rxjs';

import { Folder } from 'src/app/folder/folder.model';
import { FolderService } from 'src/app/folder/folder.service';
import { SearchService } from 'src/app/header/search.service';
import { DataStorageInDBService } from 'src/app/auth/data-storage-in-db.service';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent implements OnInit, OnDestroy {

  folders: Folder[];
  folderSubscription: Subscription;
  folderSearchQuery: string; // for Search Query functionality

  // for the table
  displayedColumns: string[] = ['select', 'name'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private folderService: FolderService, private router: Router, private route: ActivatedRoute,
    private typedFolderSearchQuery: SearchService, private dataStorageInDBService: DataStorageInDBService) { }

  
  ngOnInit() {

    // gets the items and folders data from the Firebase DB - I think this is not needed anymore
    // since it's done in item-list.component.ts anyway
    this.dataStorageInDBService.GETItemsFromDB();
    this.dataStorageInDBService.GETFoldersFromDB();

    // this subscribes to the foldersChanged observable and so it knows whenever the folders array has
    // been updated. Then it updates the template with the newly updated folder values
    this.folderSubscription = this.folderService.foldersChanged
      .subscribe(
        (folders: Folder[]) => {
          // if the table values have been changed, do these things
          this.folders = folders;
          this.setupTable();
        }
      );
    // if the table values have been not been changed, do these things that are outside of the subscribe()
    this.folders = this.folderService.getFolders();
    this.setupTable();

    // for Search Query functionality (should be inside ngOnInit)
    this.typedFolderSearchQuery.currentFolderSearchQuery
      .subscribe(
        folderSearchQuery => this.dataSource.filter = folderSearchQuery.trim().toLowerCase()
      );
  }


  selection; // for checkboxes
  setupTable() {
    this.dataSource = new MatTableDataSource<Folder>(this.folders); // added in <Folder> - should not cause bug
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selection = new SelectionModel<Folder>(true, []); // for checkboxes
  }


  // The built-in Javascript .map() function lets you convert this.folders,
  // which is an array of JSON objects,
  // to an array of properties. So it turns [{num: '1'}, {num: '2'}] to ['1', '2'].
  // The .indexOf(), or .findIndex(), then lets you find out the index of that property.
  // The solution is on https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
  findIndexOfFolderName(folderName: string) {

    return this.folders.map(

      obj => { return obj.name; }

    ).indexOf(folderName);

  }


  // for checkboxes
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log(this.selection); // this is useful for getting the values of the checkboxes
    // console.log(this.selection.selected); // this is useful for getting the values of the checkboxes
    return numSelected === numRows;
  }


  // for checkboxes
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    // console.log(this.selection.hasValue()); // useful for seeing if Master Toggle is selected (returns true) or not (returns false)
  }


  // for checkboxes
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Folder): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }


  stringArrayOfFoldersToDelete;
  onDeleteItems() {

    // this.selection (and this.selection.selected) are useful because it returns an array of objects
    // that represents what checkboxes have been selected.
    // Then, using .map() on that array of objects turns it into a string array of title properties.
    // From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
    this.stringArrayOfFoldersToDelete = this.selection.selected.map(obj => { return obj.name; });

    // this loops through the string array of title properties
    for (let i of this.stringArrayOfFoldersToDelete) {
      // this finds the index number of that specific title, and then deletes it
      this.folderService.deleteFolder(this.findIndexOfFolderName(i));
    }

    // Problem: If after this deletion, there are 0 items in the "folders" array in folder.service.ts,
    // then the array becomes automatically deleted and therefore, null (which causes errors all over the place).
    // Solution: I created this conditional statement so that there is always at least 1 item in
    //  the array so it can never become deleted and therefore, null.
    if (this.folderService.getFolders() === null ||
      this.folderService.getFolders() === undefined ||
      this.folderService.getFolders().length === 0
    ) {
      this.folderService.addFolder(new Folder('Example Folder'));
    }

    this.router.navigate(['/folders']);

    // now that the deletion(s) has happened in the local array,
    // this pushes the updated local array of data to the remote Firebase DB
    this.dataStorageInDBService.PUTFoldersIntoDB()
      .subscribe(
        // response => console.log('DELETE: ' + response)
      );
  }


  ngOnDestroy() {
    // unsubscribes in order to avoid memory leaks
    this.folderSubscription.unsubscribe();
  }

  // this method is unused but I'm keeping it for the syntax
  // onNewFolder() {
  //   this.router.navigate(['/', 'new-folder']);
  // }

  // this method is not used but the syntax may be useful in the future (it's for the search bar/filter):
  //  applyFilter(filterValue: string) {
  //    this.dataSource.filter = filterValue.trim().toLowerCase();
  //  }

}
