import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component/home';
import { LoginComponent } from './login.component/login';
import { PageComponent } from './page.component/page';

import {AuthGuard} from "./auth.guard";
import {SignupComponent} from "./signup.component/signup";

export const routes = [
  { path: '',        component: HomeComponent, terminal: true },
  { path: 'home',        component: HomeComponent, terminal: true },
  { path: 'login',   component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'page', component: PageComponent, canActivate: [AuthGuard] }
];

export const APP_ROUTES_PROVIDER = provideRouter(routes);
