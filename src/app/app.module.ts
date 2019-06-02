import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { ItemListComponent } from './item/item-list/item-list.component';
import { ItemService } from './item/item.service';
import { AppRoutingModule } from './app-routing.module';
import { ItemComponent } from './item/items.component';
import { ItemEditComponent } from './item/item-edit/item-edit.component';
import { FolderComponent } from './folder/folder.component';
import { FolderService } from './folder/folder.service';
import { FolderListComponent } from './folder/folder-list/folder-list.component';
import { FolderEditComponent } from './folder/folder-edit/folder-edit.component';
import { SearchService } from './header/search.service';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { AboutComponent } from './header/about/about.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { DataStorageInDBService } from './auth/data-storage-in-db.service';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemListComponent,
    ItemComponent,
    ItemEditComponent,
    FolderComponent,
    FolderListComponent,
    FolderEditComponent,
    SignupComponent,
    LoginComponent,
    AboutComponent,
    SettingsComponent
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
  providers: [
    ItemService,
    FolderService,
    SearchService,
    AuthService,
    AuthGuard,
    DataStorageInDBService,
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
