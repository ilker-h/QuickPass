import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/shared/folder.model';

@Component({
  selector: 'app-folder-individual-in-list',
  templateUrl: './folder-individual.component.html',
  styleUrls: ['./folder-individual.component.css']
})
export class FolderIndividualComponent implements OnInit {

  // this gives "folder" and "index" values up to folder-list-component.ts
  @Input() folder: Folder;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
  }

}
