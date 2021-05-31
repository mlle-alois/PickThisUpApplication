import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {config} from "../config/pickthisup.config";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthenticatedUserService} from "./authenticated-user.service";
import {HttpService} from "./http.service";
import {ZoneModel} from "../models/zone.model";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private httpClient: HttpClient,
              private authenticatedUserService: AuthenticatedUserService,
              private queriesService: HttpService) {
  }

  //TODO vérifier que ça marche
  getZoneById(zoneId: number): Promise<ZoneModel> {
    return new Promise((resolve, reject) =>
      this.httpClient.get(config.URL + "/zone/get/" + zoneId, {
        headers: this.queriesService.getAuthorizationHeaders()
      })
        .pipe(catchError(err => {
          if (err.status === 403) {
            this.authenticatedUserService.redirectToAuthentication();
          }
          reject(err);
          return throwError(err);
        }))
        .subscribe((result) => {
          const jsondata: any = result;
          resolve(new ZoneModel(jsondata));
        }));
  }

}
