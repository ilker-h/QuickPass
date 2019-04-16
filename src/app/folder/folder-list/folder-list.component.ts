import { Component, OnInit, OnDestroy } from '@angular/core';
import { Folder } from 'src/app/shared/folder.model';
import { Subscription } from 'rxjs';
import { FolderService } from 'src/app/folder/folder.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent implements OnInit, OnDestroy {

  folders: Folder[];
  subscription: Subscription;

  constructor(private folderService: FolderService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this subscribes to the foldersChanged observable and so it knows whenever the folders array has 
    // been updated. Then it updates the template with the newly updated folder values
    this.subscription = this.folderService.foldersChanged
      .subscribe(
        (folders: Folder[]) => {
          this.folders = folders;
        }
      );
    this.folders = this.folderService.getFolders();

  }

  // this method is unused but I'm keeping it for the syntax
  // onNewFolder() {
  //   this.router.navigate(['/', 'new-folder']);
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
