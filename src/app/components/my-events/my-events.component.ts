import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UserModel} from '../../models/user.model';
import {EventModel} from '../../models/event.model';
import {MyDate} from '../../utils/MyDate';
import {CarpoolModel} from '../../models/carpool.model';
import {MediaModel} from '../../models/media.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticatedUserService} from '../../services/authenticated-user.service';
import {EventService} from '../../services/event.service';
import {CarpoolService} from '../../services/carpool.service';
import {ZoneService} from '../../services/zone.service';
import {DateUtils} from '../../utils/DateUtils';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit,AfterViewInit {


  token: string;
  currentUser: UserModel;

  events: EventModel[] = [];
  pastEvents: EventModel[] = [];
  futureEvents: EventModel[] = [];
  currentEvents: EventModel[] = [];
  currentTimestamp: MyDate;

  isEventDetailVisible = false;
  visibleEvent: EventModel;
  eventParticipants: UserModel[];
  currentUserParticipateToEvents: Map<number, boolean>;

  eventCarpools: CarpoolModel[];
  carpoolParticipants: UserModel[];
  currentUserParticipateToCarpools: Map<number, boolean>;
  currentUserParticipateToCarpool = false;

  isCarpoolDetailVisible = false;
  visibleCarpool: CarpoolModel;

  eventPictures: MediaModel[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticatedUserService: AuthenticatedUserService,
              private eventService: EventService,
              private carpoolService: CarpoolService,
              private zoneService: ZoneService) { }


  async ngOnInit() {
    this.initToken();
    await this.initCurrentUser();
  }


  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
    this.events = await this.eventService.getAvailableEvents();
    this.pastEvents = await this.eventService.getPastEventsFromUser();
    this.futureEvents = await this.eventService.getFuturEventsFromUser();
    this.currentEvents = await this.eventService.getCurrentEventsFromUser();
    this.currentTimestamp = DateUtils.getCurrentDate();
    this.currentUserParticipateToEvents = await this.setCurrentUserParticipateToEvents(this.events);
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }

  async initCurrentUser() {
    this.currentUser = await this.authenticatedUserService.getCurrentUser();
  }

  getParticipantsOfEvent(event: EventModel): Promise<UserModel[]> {
    return this.eventService.getParticipantsEvents(event.eventId)
      .then(function (users) {
        return users;
      });
  }

  getParticipantsOfCarpool(carpool: CarpoolModel): Promise<UserModel[]> {
    return this.carpoolService.getCarpoolParticipants(carpool.carpoolId)
      .then(function (users) {
        return users;
      });
  }

  getCarpoolsOfEvent(event: EventModel): Promise<CarpoolModel[]> {
    return this.carpoolService.getCarpoolsEvent(event.eventId)
      .then(function (carpools) {
        return carpools;
      });
  }

  getPicturesOfEvent(event: EventModel): Promise<MediaModel[]> {
    return this.zoneService.getPicturesZone(event.zone.zoneId)
      .then(function (pictures) {
        return pictures;
      });
  }
  async setCurrentUserParticipateToEvents(events: EventModel[]): Promise<Map<number, boolean>> {
    const currentUserParticipateToEvent = new Map();
    for (let i = 0; i < events.length; i += 1) {
      const participants = await this.getParticipantsOfEvent(events[i]);
      let j;
      for (j = 0; j < participants.length; j += 1) {
        if (participants[j].mail === this.currentUser.mail) {
          break;
        }
      }
      if (j < participants.length) {
        currentUserParticipateToEvent.set(events[i].eventId, true);
      } else {
        currentUserParticipateToEvent.set(events[i].eventId, false);
      }
    }
    return currentUserParticipateToEvent;
  }

 /* getPastEventofCurrentUser(): Promise<UserModel[]> {
    return this.eventService.getPastEventsFromUser()
      .then( (event) => {
        return this.events;
      });
  }*/

}
