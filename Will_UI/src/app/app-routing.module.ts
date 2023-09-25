import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WillDetailsComponent } from './core/will-details/will-details.component';
import { WillViewComponent } from './core/will-view/will-view.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'will/:id', component: WillDetailsComponent },
  { path: 'will/:id/view', component: WillViewComponent },
  { path: 'will/new', component: WillDetailsComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
