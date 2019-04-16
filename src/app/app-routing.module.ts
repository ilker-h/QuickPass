import { NgModule } from "@angular/core";
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { ItemEditComponent } from './items/item-edit/item-edit.component';
import { FolderComponent } from './folder/folder.component';
import { FolderEditComponent } from './folder/folder-edit/folder-edit.component';

const appRoutes: Routes = [

    { path: '', redirectTo: '/items', pathMatch: 'full' },

    {
        path: 'items', component: ItemsComponent, children: [
            { path: 'new', component: ItemEditComponent }, // , canActivate: [AuthGuard]
            { path: ':id', component: ItemEditComponent },
        ]
    },
    //keep these in this order because if "new-folder" is below ":id" then the "new folder" feature doesn't work
    {
        path: 'folders', component: FolderComponent, children: [
            { path: 'new-folder', component: FolderEditComponent },
            { path: ':id', component: FolderEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}