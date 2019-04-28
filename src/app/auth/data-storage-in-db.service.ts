import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FolderService } from '../folder/folder.service';
import { AuthService } from './auth.service';
import { Folder } from '../shared/folder.model';
import { map } from 'rxjs/operators';

@Injectable()
export class DataStorageInDBService {

    constructor(private httpClient: HttpClient,
        private folderService: FolderService) { }

    PUTFoldersIntoDB() {
        return this.httpClient.put('https://quickpass-4ed21.firebaseio.com/folders.json', this.folderService.getFolders());
    }

    // POSTnewFolderIntoDB(newFolder: Folder) {
    //     return this.httpClient.post('https://quickpass-4ed21.firebaseio.com/folders.json', newFolder);
    // }

    GETFoldersFromDB() {
        this.httpClient.get<Folder[]>('https://quickpass-4ed21.firebaseio.com/folders.json')
            .pipe(map(
                // .map() operator transforms the JSON string you get back to whatever you want.
                // However, after an RxJS update, you now have to do .pipe(map(___)) to do the same thing.
                // I'm not sure if I need .pipe(map(___)) anymore though
                (folders) => {
                    console.log(folders);
                    return folders;
                }
            ))
            .subscribe(
                (folders: Folder[]) => {
                    this.folderService.setFolders(folders);
                }
            );
    }
}
