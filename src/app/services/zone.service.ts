import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {config} from "../config/pickthisup.config";
import {HttpService} from "./http.service";
import {ZoneModel} from "../models/zone.model";
import {MediaModel} from "../models/media.model";
import {PollutionLevel} from "../enum/pollution-level";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private readonly validated: number = 4;
  private readonly waiting: number = 5;
  private readonly refused: number = 6;

  constructor(private httpClient: HttpClient,
              private httpService: HttpService) {
  }

  async getPicturesZone(zoneId: number): Promise<MediaModel[]> {
    return (await this.httpService.getAll<MediaModel>(config.URL + '/zone/get-pictures/' + zoneId));
  }

  async getAvailableZones(): Promise<ZoneModel[]> {
    return (await this.httpService.getAll<ZoneModel>(config.URL + '/zone/'));
  }
  async getZonesByUser(): Promise<ZoneModel[]> {
    return (await this.httpService.getAll<ZoneModel>(config.URL + '/zone/my-zones'));
  }
  async getRefusedZonesByUser(): Promise<ZoneModel[]> {
    return (await (await this.getZonesByUser()).filter((zone) => zone.statusId === this.refused));
  }
  async getWaitingZonesByUser(): Promise<ZoneModel[]> {
    return (await (await this.getZonesByUser()).filter((zone) => zone.statusId === this.waiting));
  }
  async getValidatedZonesByUser(): Promise<ZoneModel[]> {
    return (await (await this.getZonesByUser()).filter((zone) => zone.statusId === this.validated));
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
