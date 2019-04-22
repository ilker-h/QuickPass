import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Item } from '../../shared/item.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { SearchService } from 'src/app/header/search.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Folder } from 'src/app/shared/folder.model';
import { FolderService } from 'src/app/folder/folder.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items: Item[];
  subscription: Subscription;
  itemSearchQuery: string; // for Search Query functionality
  allFolders: Folder[];
  itemForm: FormGroup;

      //for the table
      displayedColumns: string[] = ['select', 'title', 'username'];
      dataSource;
      @ViewChild(MatSort) sort: MatSort;
      @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemService: ItemService, private folderService: FolderService,
              private router: Router, private route: ActivatedRoute, 
              private typedItemSearchQuery: SearchService) { }

  ngOnInit() {
    
    //for populating the "Move to Folder" dropdown in the toolbar in the template
    this.allFolders = this.folderService.getFolders();

    // this subscribes to the itemsChanged observable and so it knows whenever the items array has 
    // been updated. Then it updates the template with the newly updated item values
    this.subscription = this.itemService.itemsChanged
      .subscribe(
        (items: Item[]) => {
          // if the table values have been changed, do these things
          this.items = items;
          this.setupTable();
          this.initForm();
        }
      );
    // if the table values have been not been changed, do these things that are outside of the subscribe()
    this.items = this.itemService.getItems();
    this.setupTable();
    this.initForm();

        // for Search Query functionality (should be inside ngOnInit)
        this.typedItemSearchQuery.currentItemSearchQuery.subscribe(itemSearchQuery => this.dataSource.filter = itemSearchQuery.trim().toLowerCase())
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


        // console.log(this.items.map( 

        //   (obj) => {return obj.title}
        
        //   ).indexOf(itemTitle));

        return this.items.map( 

           (obj) => {return obj.title}
         
           ).indexOf(itemTitle)

 }


/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  // console.log(numRows);
  // console.log(numSelected);
  // console.log(this.selection); // this is kind of useful
  // console.log(this.selection.selected); //this is the good one
  // console.log(this.selection.selected.length);
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
    // console.log(`${this.isAllSelected() ? 'select' : 'deselect'} all`);
    // console.log('^Line 103____________________');
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  // console.log(`${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title +1}`);
  // console.log('^Line 107____________________');
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
}

// all of this was the rough work (which works as intended) for creating the onDeleteItems() method:
// 
// ok;
// stringArrayOfThingsToDelete;
//  onDeleteItem() {
//   console.log(this.selection.selected);
//   console.log(this.selection.selected[0].title);
//     this.ok = this.findIndexOfItemTitle(this.selection.selected[0].title);
//     console.log('>>>>' + this.ok);

// console.log(
//     this.selection.selected.map( (obj) => {return obj.title} )
// );

//  this.stringArrayOfThingsToDelete = this.selection.selected.map( (obj) => {return obj.title} );
      
//       // .indexOf(this.selection.selected[0])

//       for (let one of this.stringArrayOfThingsToDelete) {

//         console.log(this.findIndexOfItemTitle(one));
//         console.log(this.itemService.getItems());

//         this.itemService.deleteItem(this.findIndexOfItemTitle(one));
//       }
//       console.log(this.itemService.getItems());
//       this.router.navigate(['/items']);

//  }


// 

private initForm() {
  let itemFolderMatchedTo;

  // this FormGroup goes into the template
  this.itemForm = new FormGroup({
    // these are from ItemService
    'folderMatchedTo': new FormControl(itemFolderMatchedTo),
    'All': new FormControl()
  })

}

// not being used:
//
// compareObjects(valueFromOption: any, valueFromSelection: any) {
//   // return o1.name === o2.name && o1.id === o2.id;
//   if(valueFromOption == valueFromSelection) {
//     console.log('true2');
//       // return true;
//   } else {
//     console.log('false2');
//     return 'All';
//   }
// }

stringArrayOfItemsToMoveToFolder;
folderNameToMoveTo;
onMoveToFolder() {
  
console.log(
  this.selection.selected.map( (obj) => {return obj.title} ) );
  console.log(this.itemForm.value['folderMatchedTo']);

// this.selection (and this.selection.selected) are useful because it returns an array of objects
// that represents what checkboxes have been selected.
//Then, using .map() on that array of objects turns it into a string array of title properties.
//From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
this.stringArrayOfItemsToMoveToFolder = this.selection.selected.map( (obj) => {return obj.title} );

this.folderNameToMoveTo = this.itemForm.value['folderMatchedTo'];

//this loops through the string array of title properties
    for (let i of this.stringArrayOfItemsToMoveToFolder) {
      console.log(i);
      console.log(this.findIndexOfItemTitle(i));
      console.log(this.itemForm.value['folderMatchedTo']);
      console.log(this.folderNameToMoveTo);
//this finds the index number of that specific title, and then deletes it
      this.itemService.updateItemFolder(this.findIndexOfItemTitle(i), this.folderNameToMoveTo);
    }
    this.router.navigate(['/items']);

}

stringArrayOfItemsToDelete;
 onDeleteItems() {

console.log(
    this.selection.selected.map( (obj) => {return obj.title} )
);

// this.selection (and this.selection.selected) are useful because it returns an array of objects
// that represents what checkboxes have been selected.
//Then, using .map() on that array of objects turns it into a string array of title properties.
//From https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties
 this.stringArrayOfItemsToDelete = this.selection.selected.map( (obj) => {return obj.title} );
      
 //this loops through the string array of title properties
      for (let i of this.stringArrayOfItemsToDelete) {
//this finds the index number of that specific title, and then deletes it
        this.itemService.deleteItem(this.findIndexOfItemTitle(i));
      }
      this.router.navigate(['/items']);
 }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}
