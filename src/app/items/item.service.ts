import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Item } from '../shared/item.model';
import { FolderService } from '../folder/folder.service';
import { Folder } from '../shared/folder.model';

@Injectable()
export class ItemService {
    // this is a subject that's going to inform places outside of this service whenever
    // values are changed/added/removed from the "items" array
    itemsChanged = new Subject<Item[]>();

    constructor(private folderService: FolderService) { };

    private items: Item[] = [
        new Item('Gitlab', 'usernameGitlab', 'passwordGitlab', 'GitlabEmail@email.com', 'www.gitlab.com', 'NotesGitlab',
            this.folderService.getFolderName(3)),
        new Item('Toggl', 'usernameToggle', 'passwordToggl', 'TogglEmail@email.com', 'www.toggl.com', 'NotesToggl',
            this.folderService.getFolderName(4)),
        new Item('Avaza', 'usernameAvaza', 'passwordAvaza', 'AvazaEmail@email.com', 'www.avaza.com', 'NotesAvaza',
            this.folderService.getFolderName(5))
    ];

    setItems(items: Item[]) {
        this.items = items;
        this.itemsChanged.next(this.items.slice());
    }

    getItems() {
        return this.items.slice();
    }

    getItem(index: number) {
        return this.items[index];
    }

    addItem(item: Item) {
        this.items.push(item);
        this.itemsChanged.next(this.items.slice());
    }

    updateItem(index: number, newItem: Item) {
        this.items[index] = newItem;
        this.itemsChanged.next(this.items.slice());
    }

    updateItemFolder(index: number, folderNameToMoveTo: Folder['name']) {
        this.items[index].folderMatchedTo = folderNameToMoveTo;
        this.itemsChanged.next(this.items.slice());
    }

    deleteItem(index: number) {
        this.items.splice(index, 1);
        this.itemsChanged.next(this.items.slice());
    }

}


