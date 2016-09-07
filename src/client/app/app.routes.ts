import { RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
//import { PageComponent } from './page.home/page';

//import {AuthGuard} from "./common/auth.guard";
//import {SignupComponent} from "./signup.home/signup";

export const routes = [
  { path: '',             component: HomeComponent, terminal: true },
  { path: 'home',         component: HomeComponent, terminal: true },
  { path: 'login',        component: LoginComponent },
//  { path: 'signup',       home: SignupComponent },
//  { path: 'page',         home: PageComponent, canActivate: [AuthGuard] }
];

export const APP_ROUTES_PROVIDER = RouterModule.forRoot(routes);
