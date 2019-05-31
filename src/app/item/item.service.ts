import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Item } from './item.model';
import { Folder } from '../folder/folder.model';

@Injectable()
export class ItemService {
    // this is a subject that's going to inform places outside of this service whenever
    // values are changed/added/removed from the "items" array
    itemsChanged = new Subject<Item[]>();

    constructor() { }

    private items: Item[] = [
        // at least one Item must be hardcoded into this array and then pushed to the Firebase DB so that
        // a place is reserved on the DB based on that specific user's Firebase UID so that every user's
        // data is separated from everyone else's data
        // (if at least one Item isn't hardcoded into the array, the array seems to become null
        // and causes errors everywhere)
        new Item('Example GitHub Account', 'john-doe', 'john-github_564', 'john-doe@gmail.com',
            'https://accounts.google.com/login?hl=en', 'Only for business use', 'Example Folder')
    ];

    // the reason .slice() is used to create a (shallow) copy of each array is because arrays are
    // reference types, so if we just want to copy the original array and not overwrite it,
    // we can use .slice(). We can also use Object.assign({}, arrayToCopy).
    // See more info about this at https://academind.com/learn/javascript/reference-vs-primitive-values/
    setItems(items: Item[]) {
        this.items = items;
        if (this.items !== null) {
            this.itemsChanged.next(this.items.slice());
        }
    }

    getItems() {
        if (this.items !== null) {
            return this.items.slice();
        }
    }

    getItem(index: number) {
        if (this.items !== null) {
            return this.items[index];
        }
    }

    addItem(item: Item) {
        this.items.push(item);
        if (this.items !== null) {
            this.itemsChanged.next(this.items.slice());
        }
    }

    updateItem(index: number, newItem: Item) {
        this.items[index] = newItem;
        if (this.items !== null) {
            this.itemsChanged.next(this.items.slice());
        }
    }

    updateItemFolder(index: number, folderNameToMoveTo: Folder['name']) {
        this.items[index].folderMatchedTo = folderNameToMoveTo;
        if (this.items !== null) {
            this.itemsChanged.next(this.items.slice());
        }
    }

    deleteItem(index: number) {
        if (this.items !== null) {
            this.items.splice(index, 1);
            this.itemsChanged.next(this.items.slice());
        }
    }



    // I'm just putting this here to show the syntax of how to check if the items array and folders array are empty or nonexistent,
    // and then send an empty folders and items JSON to the database
    // ifTheItemsAndOrFoldersArrayIsEmpty() {

    //     if (
    //         (this.items === null ||
    //             this.items === undefined ||
    //             this.items.length === 0)
    //         &&
    //         (this.folderService.getFolders() === null ||
    //             this.folderService.getFolders() === undefined ||
    //             this.folderService.getFolders().length === 0)
    //     ) {

    //         this.httpClient.put('https://quickpass-4ed21.firebaseio.com/' + firebase.auth().currentUser.uid + '.json',
    //             {
    //                 "folders": [{
    //                     "name": "from item.service.ts --------------"
    //                 }],
    //                 "items": [{
    //                     "email": "1",
    //                     "folderMatchedTo": "1",
    //                     "notes": "1",
    //                     "password": "1",
    //                     "title": "1",
    //                     "url": "1",
    //                     "username": "1"
    //                 }]
    //             }
    //         ).subscribe(
    //             response => console.log(response)
    //         );
    //         console.log('from item.service.ts --------------------------' + firebase.auth().currentUser.uid);

    //         if (this.router.url.includes('items')) {
    //             this.router.navigate(['/items']);

    //         } else if (this.router.url.includes('folders')) {
    //             this.router.navigate(['/folders']);
    //         }
    //
    // I think I now need to call an HTTP GET on the items and folders arrays here since I am PUTTING them into the DB but not showing them
    // in the frontend table right away
    //
    //     }
    // }

}


