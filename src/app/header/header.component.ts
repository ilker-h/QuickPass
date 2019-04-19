import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SearchService } from './search.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() searchQueryEventEmitter = new EventEmitter<string>();

  // searchQuery: string; // for Search Query functionality - I don't think this is being used



  public location = '' ;

  constructor(private typedSearchQuery: SearchService, private route: ActivatedRoute, private router: Router) {
    this.location = router.url;
   }

//   ngOnInit() {

// this.route.params
//     .subscribe(
//       (params: Params) => {

//         if(params['items'] === "items") {
//           console.log(params);
//         }

//       }
//     )

//   }

queryParam;

ngOnInit() {
  this.route.queryParams.subscribe(params => {
      this.queryParam = params['0'];
  });
}





  // for Search Query functionality for Folders
  onTypeFolderSearchQuery(folderSearchQuery: string) {
    console.log(folderSearchQuery);
    this.typedSearchQuery.changeFolderSearchQuery(folderSearchQuery);
  }

    // for Search Query functionality for Items
    onTypeSearchQueryItem(itemSearchQuery: string) {
      console.log(itemSearchQuery);
      this.typedSearchQuery.changeSearchQueryItem(itemSearchQuery);
    }

}
