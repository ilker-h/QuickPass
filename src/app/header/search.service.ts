import { BehaviorSubject } from 'rxjs';

export class SearchService {
    private FolderSearchQuerySource = new BehaviorSubject<string>('');
    private searchItemQuerySource = new BehaviorSubject<string>('');

    // for searching folders:
    currentFolderSearchQuery = this.FolderSearchQuerySource;

    // for searching items:
    currentItemSearchQuery = this.searchItemQuerySource;


    // for searching folders:
    changeFolderSearchQuery(newFolderSearchQuery: string) {
        this.FolderSearchQuerySource.next(newFolderSearchQuery);
    }


    // for searching items:
    changeSearchQueryItem(newSearchQueryItem: string) {
        this.searchItemQuerySource.next(newSearchQueryItem);
    }

}
