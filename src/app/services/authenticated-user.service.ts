import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserService {

  constructor(private http: HttpClient) {
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

  public setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== undefined && token !== null;
  }

  public redirectToAuthentication(): void {
    this.logout();
  }

  public redirectToAccessDeniedScreen(): void {
    // this.router.navigate(['/', 'access-denied']);
    // TODO
  }

  public logout(): void {
    if (this.getToken())
      this.removeToken();
    window.location.href = environment.authenticationUrl + '/logout';
  }
}
