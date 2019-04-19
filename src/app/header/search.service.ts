import { BehaviorSubject } from 'rxjs';

export class SearchService {

    //for searching folders:
    private searchQuerySource = new BehaviorSubject<string>("");
    currentSearchQuery = this.searchQuerySource

    changeSearchQuery(newSearchQuery: string) {
    this.searchQuerySource.next(newSearchQuery);
    }
    
}
