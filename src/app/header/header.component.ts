import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchService } from './search.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() searchQueryEventEmitter = new EventEmitter<string>();

  public location = '';

  constructor(private typedSearchQuery: SearchService, private route: ActivatedRoute,
    private router: Router, private authService: AuthService) {
    this.location = router.url;
  }

  queryParam;
  ngOnInit() {
    // is this being used?
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['0'];
    });
  }

  // for Search Query functionality for Folders
  onTypeFolderSearchQuery(folderSearchQuery: string) {
    this.typedSearchQuery.changeFolderSearchQuery(folderSearchQuery);
  }

  // for Search Query functionality for Items
  onTypeSearchQueryItem(itemSearchQuery: string) {
    this.typedSearchQuery.changeSearchQueryItem(itemSearchQuery);
  }

  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['/', 'login']);
  }

  // this lets the person click into the search bar when it's inside the hamburger menu without closing the menu
  // because by default, whenever you click somewhere inside the menu, it thinks you selected something and closes the menu
  // https://stackoverflow.com/questions/51645949/use-mat-input-while-mat-menu-is-opened-in-material2
  stopPropagation(event) {
    event.stopPropagation();
  }

}
