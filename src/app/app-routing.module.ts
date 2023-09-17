import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContractsComponent } from './contracts/contracts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error/error.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomTypesComponent } from './room-types/room-types.component';
import { SearchHotelsComponent } from './search-hotels/search-hotels.component';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [
  {path:"",redirectTo:"/dashboard",pathMatch:"full"},
  {path:'dashboard',component:DashboardComponent},
  {path:"serachHotel", component:SearchHotelsComponent},
  {path:"hotels",component:HotelsComponent},
  {path:"contracts",component:ContractsComponent},
  {path:"roomTypes",component:RoomTypesComponent},
  {path:"results",component:SearchResultComponent},
  {path:"**", component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
