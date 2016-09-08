import { RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import {NotFoundComponent} from "./components/404/404";

//import { PageComponent } from './page.home/page';

//import {AuthGuard} from "./common/auth.guard";
//import {SignupComponent} from "./signup.home/signup";

export const routes = [
  { path: '',            component: HomeComponent, terminal: true },
  { path: 'home',         component: HomeComponent, terminal: true },
  { path: 'login',        component: LoginComponent },
  // Show the 404 page for any routes that don't exist.
  { path: '**',           component: NotFoundComponent }
//  { path: 'signup',       home: SignupComponent },
//  { path: 'page',         home: PageComponent, canActivate: [AuthGuard] }
];

export const APP_ROUTES_PROVIDER = RouterModule.forRoot(routes);
