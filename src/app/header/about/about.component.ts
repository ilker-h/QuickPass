import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  downloadFile() {
    // from https://stackoverflow.com/questions/50907542/download-a-file-from-asset-folder-when-clicking-on-a-button
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.download = 'Ilker-Hadzhalaran-Resume';
    link.href = 'assets\\images\\Ilker-Hadzhalaran.jpg';
    link.click();
    link.remove();
}

}
