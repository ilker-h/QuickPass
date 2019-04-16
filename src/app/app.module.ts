import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemIndividualComponent } from './items/item-list/item-individual/item-individual.component';
import { ItemService } from './items/item.service';
import { AppRoutingModule } from './app-routing.module';
import { ItemsComponent } from './items/items.component';
import { ItemEditComponent } from './items/item-edit/item-edit.component';
import { FolderComponent } from './folder/folder.component';
import { FolderService } from './folder/folder.service';
import { FolderListComponent } from './folder/folder-list/folder-list.component';
import { FolderEditComponent } from './folder/folder-edit/folder-edit.component';
import { FolderIndividualComponent } from './folder/folder-list/folder-individual/folder-individual.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemListComponent,
    ItemIndividualComponent,
    ItemsComponent,
    ItemEditComponent,
    FolderComponent,
    FolderIndividualComponent,
    FolderListComponent,
    FolderEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule
  ],
  providers: [ItemService, FolderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
