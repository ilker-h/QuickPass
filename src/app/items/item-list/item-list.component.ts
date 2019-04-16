import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../../shared/item.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items: Item[];
  subscription: Subscription;

  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    // this subscribes to the itemsChanged observable and so it knows whenever the items array has 
    // been updated. Then it updates the template with the newly updated item values
    this.subscription = this.itemService.itemsChanged
      .subscribe(
        (items: Item[]) => {
          this.items = items;
        }
      );
    this.items = this.itemService.getItems();
  }

  // this method is currently unused but I'm keeping it for the syntax:
  // onNewItem() {
  //   this.router.navigate(['/', 'new']); // using ['../new'] also works but I think this other one is better
  //   // this.router.navigate(['new'], {relativeTo: this.route});  <== it used to be this but I changed it
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}
