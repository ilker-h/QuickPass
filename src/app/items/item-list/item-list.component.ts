import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Item } from '../../shared/item.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items: Item[];
  subscription: Subscription;

      //for the table
      displayedColumns: string[] = ['title', 'username'];
      dataSource;
      @ViewChild(MatSort) sort: MatSort;
      @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    // this subscribes to the itemsChanged observable and so it knows whenever the items array has 
    // been updated. Then it updates the template with the newly updated item values
    this.subscription = this.itemService.itemsChanged
      .subscribe(
        (items: Item[]) => {
          // if the table values have been changed, do these things
          this.items = items;
          this.setupTable();
        }
      );
    // if the table values have been not been changed, do these things that are outside of the subscribe()
    this.items = this.itemService.getItems();
    this.setupTable();
  }

  // this method is currently unused but I'm keeping it for the syntax:
  // onNewItem() {
  //   this.router.navigate(['/', 'new']); // using ['../new'] also works but I think this other one is better
  //   // this.router.navigate(['new'], {relativeTo: this.route});  <== it used to be this but I changed it
  // }


  setupTable() {
    this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
  }

      // The built-in Javascript .map() function lets you convert this.folders, 
      // which is an array of JSON objects,
      // to an array of properties. So it turns [{num: '1'}, {num: '2'}] to ['1', '2'].
      // The .indexOf(), or .findIndex(), then lets you find out the index of that property.
      // The solution is on https://stackoverflow.com/questions/34309090/convert-array-of-objects-into-array-of-properties 
      findIndexOfItemTitle(itemTitle: string) {

        return this.items.map( 

           (obj) => {return obj.title}
         
           ).indexOf(itemTitle)

 }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}
