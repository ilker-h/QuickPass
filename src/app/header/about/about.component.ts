import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
  }

  // downloadFile() {
  //   // from https://stackoverflow.com/questions/50907542/download-a-file-from-asset-folder-when-clicking-on-a-button
  //   const link = document.createElement('a');
  //   link.setAttribute('type', 'hidden');
  //   link.download = 'Ilker-Hadzhalaran-Resume';
  //   link.href = 'assets\\images\\Ilker-Hadzhalaran.jpg';
  //   link.click();
  //   link.remove();
  // }

  // For changing the DOM's title (the one shown in a browser tab),
  // originally from the index.html file's <head> tag.
  // Documentation: https://angular.io/guide/set-document-title
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
