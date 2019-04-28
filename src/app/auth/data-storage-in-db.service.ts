import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FolderService } from '../folder/folder.service';
import { AuthService } from './auth.service';
import { Folder } from '../shared/folder.model';
import { map } from 'rxjs/operators';
import { ItemService } from '../items/item.service';
import { Item } from '../shared/item.model';

@Injectable()
export class DataStorageInDBService {

    constructor(private httpClient: HttpClient, private itemService: ItemService,
        private folderService: FolderService) { }

    // _____________________________ Item Communication with Firebase DB _____________________________

    PUTItemsIntoDB() {
        return this.httpClient.put('https://quickpass-4ed21.firebaseio.com/items.json', this.itemService.getItems());
    }

    GETItemsFromDB() {
        this.httpClient.get<Item[]>('https://quickpass-4ed21.firebaseio.com/items.json')
            .pipe(map(
                // .map() operator transforms the JSON string you get back to whatever you want.
                // However, after an RxJS update, you now have to do .pipe(map(___)) to do the same thing.
                // I'm not sure if I need .pipe(map(___)) anymore though
                (items) => {
                    console.log('items worked: ' + items);
                    return items;
                }
            ))
            .subscribe(
                (items: Item[]) => {
                    this.itemService.setItems(items);
                }
            );
    }


    // _____________________________ Folder Communication with Firebase DB _____________________________

    PUTFoldersIntoDB() {
        return this.httpClient.put('https://quickpass-4ed21.firebaseio.com/folders.json', this.folderService.getFolders());
    }

    GETFoldersFromDB() {
        this.httpClient.get<Folder[]>('https://quickpass-4ed21.firebaseio.com/folders.json')
            .pipe(map(
                // .map() operator transforms the JSON string you get back to whatever you want.
                // However, after an RxJS update, you now have to do .pipe(map(___)) to do the same thing.
                // I'm not sure if I need .pipe(map(___)) anymore though
                (folders) => {
                    console.log('folders worked: ' + folders);
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
