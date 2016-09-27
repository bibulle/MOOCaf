import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import {NotFoundComponent} from "./components/404/404";
import {CatalogueComponent} from "./components/catalogue/catalogue";
import {AuthGuard} from "./common/auth.guard";
import {ClassComponent} from "./components/classe/class";

//import { PageComponent } from './page.home/page';

//import {AuthGuard} from "./common/auth.guard";
//import {SignupComponent} from "./signup.home/signup";

export const routes = [
  { path: '',             redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',         component: HomeComponent,     terminal: true },
  { path: 'login',        component: LoginComponent },
  { path: 'catalogue',    component: CatalogueComponent, canActivate: [AuthGuard] },
  { path: 'classes',      component: ClassComponent, canActivate: [AuthGuard] },
  { path: 'classes/:id',  component: ClassComponent, canActivate: [AuthGuard] },
  // Show the 404 page for any routes that don't exist.
  { path: '**',            component: NotFoundComponent }
//  { path: 'signup',       home: SignupComponent },
//  { path: 'page',         home: PageComponent, canActivate: [AuthGuard] }
];


export const appRoutingProviders: any[] = [
  //authProviders,
  //CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

