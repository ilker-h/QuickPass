import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { SearchService } from './search.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() searchQueryEventEmitter = new EventEmitter<string>();


  constructor(private typedSearchQuery: SearchService, private router: Router,
    public authService: AuthService, public titleService: Title) {
  }


  public ngOnInit() {
  }


  // for Search Query functionality for Folders
  public onTypeFolderSearchQuery(folderSearchQuery: string) {
    this.typedSearchQuery.changeFolderSearchQuery(folderSearchQuery);
  }


  // for Search Query functionality for Items
  public onTypeSearchQueryItem(itemSearchQuery: string) {
    this.typedSearchQuery.changeSearchQueryItem(itemSearchQuery);
  }


  public onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['/', 'login']);
    this.setTitle('Log In | QuickPass');
  }


  // For changing the DOM's title (the one shown in a browser tab),
  // originally from the index.html file's <head> tag.
  // Documentation: https://angular.io/guide/set-document-title
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  // this lets the person click into the search bar when it's inside the hamburger menu without closing the menu
  // because by default, whenever you click somewhere inside the menu, it thinks you selected something and closes the menu
  // https://stackoverflow.com/questions/51645949/use-mat-input-while-mat-menu-is-opened-in-material2
  public stopPropagation(event) {
    event.stopPropagation();
  }

}
