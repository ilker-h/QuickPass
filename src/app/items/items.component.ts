import { Component, OnInit } from '@angular/core';
import { DataStorageInDBService } from '../auth/data-storage-in-db.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
