import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {UserService} from "../services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
  private userService: UserService) {}

  canActivate() {
    this.userService.checkAuthent()

    if (tokenNotExpired()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
