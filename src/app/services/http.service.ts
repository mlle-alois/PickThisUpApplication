import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";
import {config} from "../config/pickthisup.config";
import {AuthenticatedUserService} from "./authenticated-user.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private authenticatedUserService: AuthenticatedUserService,
              private httpClient: HttpClient) {
  }

  getAuthorizationHeaders() {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.authenticatedUserService.getToken()}`)
      .set('content-type', 'application/json');
  }

  get<T>(url: string): Promise<T | undefined> {
    return new Promise((resolve, reject) =>
      this.httpClient.get(url, {
        headers: {
          'Authorization': `Bearer ${this.authenticatedUserService.getToken()}`,
          'content-type': 'application/json'
        },
        responseType: 'json',
        observe: 'response'
      })
        .subscribe(
          (data) => {
            if (data.status === 204) {
              resolve(undefined);
            } else if (data.body && data.body[`response_code`] === 0) {
              resolve(data.body[`result`]);
            } else {
              reject(data.body ? data.body[`result`] : '');
            }
          },
          (error) => {
            if (error.status === 401 || error.status === 403) {
              this.authenticatedUserService.redirectToAuthentication();
            } else {
              reject(error);
            }
          }
        )
    );
  }

  getAll<T>(url: string): Promise<T[]> {
    return new Promise((resolve, reject) => this.httpClient.get(url, {
        headers: {
          'Authorization': `Bearer ${this.authenticatedUserService.getToken()}`,
          'content-type': 'application/json'
        },
        responseType: 'json',
        observe: 'response'
      })
        .subscribe(
          (data) => {
            if (data.status === 204) {
              resolve([]);
            } else if (data.body) {
              let res = data.body as T[];
              res = res.map(function (res) {
                return res;
              })
              resolve(res);
            } else {
              reject(data.body ? data.body : []);
            }
          },
          (error) => {
            console.log(error)
            if (error.status === 401 || error.status === 403) {
              this.authenticatedUserService.redirectToAuthentication();
            } else {
              reject(error);
            }
          }
        )
    );
  }

}
