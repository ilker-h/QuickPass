import { Folder } from './folder.model';

export class Item {

    // "folderMatchedTo" is matching a given item with a folder name in FolderService
    constructor(public title: string, public username: string, public password: string,
        public email: string, public url: string, public notes: string, public folderMatchedTo: Folder['name']) {
    }
}