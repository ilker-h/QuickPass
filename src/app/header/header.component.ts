import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() searchQueryEventEmitter = new EventEmitter<string>();

  // searchQuery: string; // for Search Query functionality - I don't think this is being used

  constructor(private typedSearchQuery: SearchService) { }

  ngOnInit() {
  }

  // for Search Query functionality for Folders
  onTypeFolderSearchQuery(searchQuery: string) {
    console.log(searchQuery);
    this.typedSearchQuery.changeFolderSearchQuery(searchQuery);
  }

    // for Search Query functionality for Items
    onTypeSearchQueryItem(searchQueryItem: string) {
      console.log(searchQueryItem);
      this.typedSearchQuery.changeSearchQueryItem(searchQueryItem);
    }

}
