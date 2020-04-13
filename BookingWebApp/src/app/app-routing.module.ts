import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './modules/home/landing-page/landing-page.component';
import { PageNotFoundComponent } from './modules/utility/page-not-found/page-not-found.component';
import { AuthGuard } from './modules/authentication/auth.guard';
import { HotelNavigationComponent } from './modules/booking/hotel-navigation/hotel-navigation.component';
import { RoomNavigationComponent } from './modules/booking/room-navigation/room-navigation.component';

export const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: 'booking',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HotelNavigationComponent,
      },
      {
        path: ':id/rooms',
        component: RoomNavigationComponent
      }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
