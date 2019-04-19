import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() searchQueryEventEmitter = new EventEmitter<string>();

  message: string; // for Search Query functionality

  constructor(private typedSearchQuery: SearchService) { }

  ngOnInit() {
  }

  // for Search Query functionality
  onTypeSearchQuery(searchQuery: string) {
    console.log(searchQuery);
    this.typedSearchQuery.changeSearchQuery(searchQuery);
  }

  

}
