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
import { RoleComponent } from './components/role/role.component';
import { DepartamentComponent } from './components/departament/departament.component';
import { PublicationComponent } from './components/publication/publication.component';
import { IconsComponent } from './components/icons/icons.component';
import { CreateComponent } from './components/create/create.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
     canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'stadistics',
    component: StadisticsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'terminos-condiciones',
    component: TerminosCondicionesComponent,
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
      component: PlantComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'role',
      component: RoleComponent,
      canActivate: [AuthGuard]

    },
    {
      path: 'departament',
      component: DepartamentComponent,
      canActivate: [AuthGuard]

    },
    {
      path: 'publication',
      component: PublicationComponent,
      canActivate: [AuthGuard]

    },
    {
      path: 'icons',
      component: IconsComponent,
      canActivate: [AuthGuard]

    },
    {
    path:'notificaciones',
      component: NotificacionesComponent,
      canActivate: [AuthGuard]

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
