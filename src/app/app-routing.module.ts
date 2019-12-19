import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './components/news/news.component';
import { TransportComponent } from './components/transport/transport.component';
import { FoodComponent } from './components/food/food.component';
import { HealthComponent } from './components/health/health.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PlantComponent } from './components/plant/plant.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [AuthGuard]
  },
    {
      path: 'news',
      component: NewsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'transport',
        component: TransportComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'food',
        component: FoodComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'health',
        component: HealthComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]

    },
    {
      path: 'plant',
      component: PlantComponent
    },
    {
      path: '**',
      pathMatch: 'full',
      redirectTo: '/login'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
