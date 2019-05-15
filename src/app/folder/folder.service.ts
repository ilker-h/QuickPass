import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Folder } from '../shared/folder.model';

@Injectable()
export class FolderService {
    // this is a subject that's going to inform places outside of this service whenever
    // values are changed/added/removed from the "folders" array
    foldersChanged = new Subject<Folder[]>();

    private folders: Folder[] = [
        // at least one Folder must be hardcoded into this array and then pushed to the Firebase DB so that
        // a place is reserved on the DB based on that specific user's Firebase UID so that every user's
        // data is separated from everyone else's data
        // (if at least one Folder isn't hardcoded into the array, the array seems to become null
        // and causes errors everywhere)
        new Folder('3'),
        // new Folder('GitlabFolder2'),
        // new Folder('ToggleFolder2'),
        // new Folder('AvazaFolder2'),
        // new Folder('GitlabFolderMatched3'),
        // new Folder('TogglFolderMatched3'),
        // new Folder('AvazaFolderMatched3')
    ];

    // the reason .slice() is used to create a (shallow) copy of each array is because arrays are
    // reference types, so if we just want to copy the original array and not overwrite it,
    // we can use .slice(). We can also use Object.assign({}, arrayToCopy).
    // See more info about this at https://academind.com/learn/javascript/reference-vs-primitive-values/
    setFolders(folders: Folder[]) {
        this.folders = folders;
        if (this.folders !== null) {
            this.foldersChanged.next(this.folders.slice());
        }
    }

    getFolders() {
        if (this.folders !== null) {
            return this.folders.slice();
        }
    }

    getFolderName(index: number) {
        if (this.folders !== null) {
            return this.folders[index].name;
        }
    }

    getFolder(index: number) {
        if (this.folders !== null) {
            return this.folders[index];
        }
    }

    addFolder(folder: Folder) {
        this.folders.push(folder);
        if (this.folders !== null) {
            this.foldersChanged.next(this.folders.slice());
        }
    }

    updateFolder(index: number, newFolder: Folder) {
        this.folders[index] = newFolder;
        if (this.folders !== null) {
            this.foldersChanged.next(this.folders.slice());
        }
    }

    updateFolderName(index: number, newFolderName: Folder['name']) {
        this.folders[index].name = newFolderName;
        if (this.folders !== null) {
            this.foldersChanged.next(this.folders.slice());
        }
    }

    deleteFolder(index: number) {
        if (this.folders !== null) {
            this.folders.splice(index, 1);
            this.foldersChanged.next(this.folders.slice());
        }
    }

}


