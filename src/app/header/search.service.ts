import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SearchService {
    private FolderSearchQuerySource = new BehaviorSubject<string>('');
    private searchItemQuerySource = new BehaviorSubject<string>('');

    // for searching folders:
    public currentFolderSearchQuery: any = this.FolderSearchQuerySource;

    // for searching items:
    public currentItemSearchQuery: any = this.searchItemQuerySource;


    // for searching folders:
    public changeFolderSearchQuery(newFolderSearchQuery: string) {
        this.FolderSearchQuerySource.next(newFolderSearchQuery);
    }


    // for searching items:
    public changeSearchQueryItem(newSearchQueryItem: string) {
        this.searchItemQuerySource.next(newSearchQueryItem);
    }

}
