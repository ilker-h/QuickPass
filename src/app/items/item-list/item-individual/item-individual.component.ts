import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/shared/item.model';

@Component({
  selector: 'app-item-individual',
  templateUrl: './item-individual.component.html',
  styleUrls: ['./item-individual.component.css']
})
export class ItemIndividualComponent implements OnInit {

  // this gives "item" and "index" values up to item-list-component.ts
  @Input() item: Item;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
  }

}
