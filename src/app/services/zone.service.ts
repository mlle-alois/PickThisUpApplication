import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {config} from "../config/pickthisup.config";
import {AuthenticatedUserService} from "./authenticated-user.service";
import {HttpService} from "./http.service";
import {ZoneModel} from "../models/zone.model";
import {MediaModel} from "../models/media.model";
import {PollutionLevel} from "../enum/pollution-level";

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

  async signalZone(zone: ZoneModel): Promise<ZoneModel> {
    let pollutionLevel: PollutionLevel;
    if(zone['zonePollutionLevel'] as unknown as string === 'Faible') {
      pollutionLevel = PollutionLevel.Low;
    }
    else if (zone['zonePollutionLevel'] as unknown as string === 'Elevé') {
      pollutionLevel = PollutionLevel.High;
    }
    else {
      pollutionLevel = PollutionLevel.Medium;
    }
    return (await this.httpService.post<ZoneModel>(config.URL + "/zone/add", {
      street: zone['zoneStreet'],
      zipcode: zone['zoneZipcode'],
      city: zone['zoneCity'],
      description: zone['zoneDescription'],
      pollutionLevel: pollutionLevel
    }));
  }

  async addPictureToZone(zoneId: number, mediaPath: string): Promise<MediaModel> {
    return (await this.httpService.post<MediaModel>(config.URL + "/zone/add-picture", {
      zoneId: zoneId,
      path: mediaPath
    }));
  }

}
