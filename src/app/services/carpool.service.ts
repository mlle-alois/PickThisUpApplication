import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {config} from "../config/pickthisup.config";
import {AuthenticatedUserService} from "./authenticated-user.service";
import {HttpService} from "./http.service";
import {CarpoolModel} from "../models/carpool.model";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class CarpoolService {

  constructor(private httpClient: HttpClient,
              private authenticatedUserService: AuthenticatedUserService,
              private httpService: HttpService) {
  }

  async getCarpoolsEvent(eventId: number): Promise<CarpoolModel[]> {
    return await this.httpService.getAll<CarpoolModel>(config.URL + "/carpool/getByEvent/" + eventId);
  }

  async getCarpoolParticipants(eventId: number): Promise<UserModel[]> {
    return (await this.httpService.getAll<UserModel>(config.URL + "/carpool/getParticipants/" + eventId));
  }

  async registerToCarpool(carpoolId: number): Promise<UserModel[]> {
    return (await this.httpService.post<UserModel>(config.URL + "/carpool/register/" + carpoolId));
  }

  async unregisterToCarpool(carpoolId: number): Promise<UserModel[]> {
    return (await this.httpService.delete<UserModel>(config.URL + "/carpool/unregister/" + carpoolId));
  }

}