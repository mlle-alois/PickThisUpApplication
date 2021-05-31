import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {config} from "../config/pickthisup.config";
import {AuthenticatedUserService} from "./authenticated-user.service";
import {HttpService} from "./http.service";
import {EventModel} from "../models/event.model";
import {MyDate} from "../utils/MyDate";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient,
              private authenticatedUserService: AuthenticatedUserService,
              private httpService: HttpService) {
  }

  async getAvailableEvents(): Promise<EventModel[]> {
    return (await this.httpService.getAll<EventModel>(config.URL + "/event"))
      .map(function (event) {
        event.dateHourStart = new MyDate(event.dateHourStart);
        event.dateHourEnd = new MyDate(event.dateHourEnd);
        event.dateHourCreation = new MyDate(event.dateHourCreation);
        return event;
    });
  }

}
