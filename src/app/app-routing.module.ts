import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { ItemEditComponent } from './items/item-edit/item-edit.component';
import { FolderComponent } from './folder/folder.component';
import { FolderEditComponent } from './folder/folder-edit/folder-edit.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AboutComponent } from './header/about/about.component';
import { AuthGuard } from './auth/auth-guard.service';

const appRoutes: Routes = [

    // if not logged in, this is where you can go:
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'about', component: AboutComponent },


    // if logged in, the following pages are where you can go:
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    {// :id is a dynamic value and is extracted by express (the name can be anything, not just "id")
        path: 'items', component: ItemsComponent, canActivate: [AuthGuard], children: [
            { path: 'new', component: ItemEditComponent, canActivate: [AuthGuard] }, // , canActivate: [AuthGuard]
            { path: ':id', component: ItemEditComponent, canActivate: [AuthGuard] },
        ]
    },
    //keep these in this order because if "new-folder" is below ":id" then the "new folder" feature doesn't work
    {
        path: 'folders', component: FolderComponent, canActivate: [AuthGuard], children: [
            { path: 'new-folder', component: FolderEditComponent, canActivate: [AuthGuard] },
            { path: ':id', component: FolderEditComponent, canActivate: [AuthGuard] }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}