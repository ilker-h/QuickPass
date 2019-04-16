import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Folder } from '../shared/folder.model';

@Injectable()
export class FolderService {
    // this is a subject that's going to inform places outside of this service whenever
    // values are changed/added/removed from the "folders" array
    foldersChanged = new Subject<Folder[]>();

    private folders: Folder[] = [
        new Folder('GitlabFolder2'),
        new Folder('ToggleFolder2'),
        new Folder('AvazaFolder2'),
        new Folder('GitlabFolderMatched3'),
        new Folder('TogglFolderMatched3'),
        new Folder('AvazaFolderMatched3')
    ];

    setFolders(folders: Folder[]) {
        this.folders = folders;
        this.foldersChanged.next(this.folders.slice());
    }

    getFolders() {
        return this.folders.slice();
    }

    getFolderName(index: number) {
        return this.folders[index].name;
    }

    getFolder(index: number) {
        return this.folders[index];
    }

    addFolder(folder: Folder) {
        this.folders.push(folder);
        this.foldersChanged.next(this.folders.slice());
    }

    updateFolder(index: number, newFolder: Folder) {
        this.folders[index] = newFolder;
        this.foldersChanged.next(this.folders.slice());
    }

    updateFolderName(index: number, newFolderName: Folder['name']) {
        this.folders[index].name = newFolderName;
        this.foldersChanged.next(this.folders.slice());
    }

    deleteFolder(index: number) {
        this.folders.splice(index, 1);
        this.foldersChanged.next(this.folders.slice());
    }

}


