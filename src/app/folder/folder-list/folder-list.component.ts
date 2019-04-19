import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

import { Folder } from 'src/app/shared/folder.model';
import { Subscription } from 'rxjs';
import { FolderService } from 'src/app/folder/folder.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/header/search.service';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent implements OnInit, OnDestroy {

  folders: Folder[];
  subscription: Subscription;
  folderSearchQuery: string; // for Search Query functionality

    //for the table
    displayedColumns: string[] = ['name'];
    dataSource;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private folderService: FolderService, private router: Router, private route: ActivatedRoute,
              private typedFolderSearchQuery: SearchService) { }

  ngOnInit() {
    // this subscribes to the foldersChanged observable and so it knows whenever the folders array has 
    // been updated. Then it updates the template with the newly updated folder values
    this.subscription = this.folderService.foldersChanged
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
    this.typedFolderSearchQuery.currentFolderSearchQuery.subscribe(folderSearchQuery => this.dataSource.filter = folderSearchQuery.trim().toLowerCase())

  }

  // this method is unused but I'm keeping it for the syntax
  // onNewFolder() {
  //   this.router.navigate(['/', 'new-folder']);
  // }

  setupTable() {
    this.dataSource = new MatTableDataSource<Folder>(this.folders); //added in <Folder> - should not cause bug
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
  }

      // The built-in Javascript .map() function lets you convert this.folders, 
      // which is an array of JSON objects,
      // to an array of properties. So it turns [{num: '1'}, {num: '2'}] to ['1', '2'].
      // The .indexOf(), or .findIndex(), then lets you find out the index of that property.
      // The solution is on https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties 
      findIndexOfFolderName(folderName: string) {

        return this.folders.map( 

           (obj) => {return obj.name}
         
           ).indexOf(folderName)

 }

 // this function is not used:
//  applyFilter(filterValue: string) {
//    this.dataSource.filter = filterValue.trim().toLowerCase();
//  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
