import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsComponent } from './components/news/news.component';
import { TransportComponent } from './components/transport/transport.component';
import { FoodComponent } from './components/food/food.component';
import { HealthComponent } from './components/health/health.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
    {
      path: 'news',
      component: NewsComponent,
      // canActivate: [AuthGuard]
    },
    {
        path: 'transport',
        component: UsersComponent
    },
    {
        path: 'food',
        component: UsersComponent
    },
    {
        path: 'health',
        component: UsersComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
      path: '**',
      pathMatch: 'full',
      redirectTo: '/'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
