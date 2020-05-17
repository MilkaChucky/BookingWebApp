import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './modules/home/landing-page/landing-page.component';
import { PageNotFoundComponent } from './modules/utility/page-not-found/page-not-found.component';
import { AuthGuard } from './modules/authentication/auth.guard';
import { HotelNavigationComponent } from './modules/booking/hotel-navigation/hotel-navigation.component';
import { RoomNavigationComponent } from './modules/booking/room-navigation/room-navigation.component';
import { AdminNavigationComponent } from './modules/admin/admin-navigation/admin-navigation.component';
import { EditHotelComponent } from './modules/admin/admin-navigation/edit/edit-hotel/edit-hotel.component';
import { EditRoomComponent } from './modules/admin/admin-navigation/edit/edit-room/edit-room.component';
import { BookingNavigationComponent } from './modules/booking/booking-navigation/booking-navigation.component';
import { ReviewNavigationComponent } from './modules/booking/review-navigation/review-navigation.component';
import { AdminGuard } from './modules/authentication/admin.guard';

export const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  {
    path: 'booking',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: BookingNavigationComponent,
      }
    ]
  },
  { path: 'hotels',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HotelNavigationComponent,
      },
      {
        path: ':id/rooms',
        component: RoomNavigationComponent
      },
      {
        path: ':id/reviews',
        component: ReviewNavigationComponent
      }
    ]
  },
  { path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminNavigationComponent
      },
      {
        path: 'add-hotel',
        component: EditHotelComponent
      },
      {
        path: 'edit-hotel/:id',
        component: EditHotelComponent
      },
      {
        path: 'add-room',
        component: EditRoomComponent
      },
      {
        path: 'edit-room/:id',
        component: EditRoomComponent
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
