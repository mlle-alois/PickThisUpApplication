import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticatedUserService} from "../../services/authenticated-user.service";
import {EventModel} from "../../models/event.model";
import {EventService} from "../../services/event.service";
import {DateUtils} from "../../utils/DateUtils";
import {MyDate} from "../../utils/MyDate";
import {UserModel} from "../../models/user.model";
import {CarpoolModel} from "../../models/carpool.model";
import {CarpoolService} from "../../services/carpool.service";
import {MediaModel} from "../../models/media.model";
import {ZoneService} from "../../services/zone.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  token: string;
  currentUser: UserModel;

  events: EventModel[] = [];
  currentTimestamp: MyDate;

  isEventDetailVisible = false;
  visibleEvent: EventModel;
  eventParticipants: UserModel[];
  currentUserParticipateToEvents: Map<number, boolean>;

  eventCarpools: CarpoolModel[];
  carpoolParticipants: UserModel[];
  currentUserParticipateToCarpools: Map<number, boolean>;
  currentUserParticipateToCarpool = false;

  eventPictures: MediaModel[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticatedUserService: AuthenticatedUserService,
              private eventService: EventService,
              private carpoolService: CarpoolService,
              private zoneService: ZoneService) {
  }

  ngOnInit() {
    this.initToken();
  }

  async ngAfterViewInit() {
    await this.initCurrentUser();
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
    this.events = await this.eventService.getAvailableEvents();
    this.currentTimestamp = DateUtils.getCurrentDate();
    this.currentUserParticipateToEvents = await this.setCurrentUserParticipateToEvents(this.events);
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }

  async initCurrentUser() {
    this.currentUser = await this.authenticatedUserService.getCurrentUser();
  }

  async onEventDetailClicked(event: EventModel): Promise<void> {
    this.isEventDetailVisible = true;
    this.visibleEvent = event;
    this.eventParticipants = await this.getParticipantsOfEvent(event);
    this.eventCarpools = await this.getCarpoolsOfEvent(event);
    this.currentUserParticipateToCarpools = await this.setCurrentUserParticipateToCarpools(this.eventCarpools);
    this.eventPictures = await this.getPicturesOfEvent(event);
      [new MediaModel({mediaId: 0, mediaPath: "clean-2_web.jpg"}),
      new MediaModel({mediaId: 0, mediaPath: "pickThisUpLogo.PNG"})]
  }

  async onCarpoolDetailClicked(event: EventModel): Promise<void> {
    //TODO
    /*this.isEventDetailVisible = true;
    this.visibleEvent = event;
    this.eventParticipants = await this.getParticipantsOfEvent(event);
    this.eventCarpools = await  this.getCarpoolsOfEvent(event);
    this.currentUserParticipateToCarpools = await this.setCurrentUserParticipateToCarpools(this.eventCarpools);*/
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

  //TODO vérifier que c'est faisable avec des fonctions de js
  async setCurrentUserParticipateToEvents(events: EventModel[]): Promise<Map<number, boolean>> {
    const currentUserParticipateToEvent = new Map();
    const currentUser = await this.authenticatedUserService.getCurrentUser();
    for (let i = 0; i < events.length; i += 1) {
      const participants = await this.getParticipantsOfEvent(events[i]);
      let j;
      for (j = 0; j < participants.length; j += 1) {
        if (participants[j].mail === currentUser.mail) {
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

  //TODO vérifier que c'est faisable avec des fonctions de js
  async setCurrentUserParticipateToCarpools(carpools: CarpoolModel[]): Promise<Map<number, boolean>> {
    const currentUserParticipateToCarpools = new Map();
    const currentUser = await this.authenticatedUserService.getCurrentUser();
    for (let i = 0; i < carpools.length; i += 1) {
      const participants = await this.getParticipantsOfCarpool(carpools[i]);
      let j;
      for (j = 0; j < participants.length; j += 1) {
        if (participants[j].mail === currentUser.mail) {
          if (j < participants.length) {
            currentUserParticipateToCarpools.set(carpools[i].eventId, true);
            this.currentUserParticipateToCarpool = true;
          } else {
            currentUserParticipateToCarpools.set(carpools[i].eventId, false);
          }
        }
      }
    }
    return currentUserParticipateToCarpools;
  }
}
