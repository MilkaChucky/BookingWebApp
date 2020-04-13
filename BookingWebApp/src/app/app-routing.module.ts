import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './modules/home/landing-page/landing-page.component';
import { PageNotFoundComponent } from './modules/utility/page-not-found/page-not-found.component';
import { AuthGuard } from './modules/authentication/auth.guard';

export const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
