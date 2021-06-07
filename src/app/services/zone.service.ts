import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {config} from "../config/pickthisup.config";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthenticatedUserService} from "./authenticated-user.service";
import {HttpService} from "./http.service";
import {ZoneModel} from "../models/zone.model";
import {MediaModel} from "../models/media.model";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private httpClient: HttpClient,
              private authenticatedUserService: AuthenticatedUserService,
              private httpService: HttpService) {
  }

  async getPicturesZone(zoneId: number): Promise<MediaModel[]> {
    return (await this.httpService.getAll<MediaModel>(config.URL + "/zone/get-pictures/" + zoneId));
  }


}
