import { BehaviorSubject } from 'rxjs';

export class SearchService {

    //for searching folders:
    private FolderSearchQuerySource = new BehaviorSubject<string>("");
    currentFolderSearchQuery = this.FolderSearchQuerySource

    changeFolderSearchQuery(newFolderSearchQuery: string) {
    this.FolderSearchQuerySource.next(newFolderSearchQuery);
    }


    //for searching items:
    private searchItemQuerySource = new BehaviorSubject<string>("");
    currentItemSearchQuery = this.searchItemQuerySource

    changeSearchQueryItem(newSearchQueryItem: string) {
    this.searchItemQuerySource.next(newSearchQueryItem);
    }
    
}
