import {Component, OnInit, AfterViewInit} from '@angular/core';
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
export class MyEventsComponent implements OnInit, AfterViewInit {

  token: string;
  currentUser: UserModel;
  private readonly validated: number = 4;
  private readonly waiting: number = 5;
  private readonly refused: number = 6;

  pastEvents: EventModel[] = [];
  futureEvents: EventModel[] = [];
  currentEvents: EventModel[] = [];
  currentTimestamp: MyDate;
  pastEventsValidated: EventModel[] = [];
  futureEventsValidated: EventModel[] = [];
  currentEventsValidated: EventModel[] = [];
  pastEventsWaiting: EventModel[] = [];
  futureEventsWaiting: EventModel[] = [];
  currentEventsWaiting: EventModel[] = [];
  pastEventsRefused: EventModel[] = [];
  futureEventsRefused: EventModel[] = [];
  currentEventsRefused: EventModel[] = [];

  isEventDetailVisible = false;
  visibleEvent: EventModel;
  eventParticipants: UserModel[];

  eventCarpools: CarpoolModel[];
  carpoolParticipants: UserModel[];

  isCarpoolDetailVisible = false;
  visibleCarpool: CarpoolModel;

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


  async ngOnInit() {
    this.initToken();
    await this.initCurrentUser();
  }

  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
    this.pastEvents = await this.eventService.getPastEventsFromUser();
    this.futureEvents = await this.eventService.getFuturEventsFromUser();
    this.currentEvents = await this.eventService.getCurrentEventsFromUser();

    this.pastEventsValidated = this.pastEvents.filter((event) => event.statusId === this.validated);
    this.currentEventsValidated = this.currentEvents.filter((event) => event.statusId === this.validated);
    this.futureEventsValidated = this.futureEvents.filter((event) => event.statusId === this.validated);

    this.pastEventsWaiting = this.pastEvents.filter((event) => event.statusId === this.waiting);
    this.currentEventsWaiting = this.currentEvents.filter((event) => event.statusId === this.waiting);
    this.futureEventsWaiting = this.futureEvents.filter((event) => event.statusId === this.waiting);

    this.pastEventsRefused = this.pastEvents.filter((event) => event.statusId === this.refused);
    this.currentEventsRefused = this.currentEvents.filter((event) => event.statusId === this.refused);
    this.futureEventsRefused = this.futureEvents.filter((event) => event.statusId === this.refused);

    this.currentTimestamp = DateUtils.getCurrentDate();
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }

  async initCurrentUser() {
    this.currentUser = await this.authenticatedUserService.getCurrentUser();
  }

  getParticipantsOfEvent(event: EventModel): Promise<UserModel[]> {
    return this.eventService.getParticipantsEvents(event.eventId)
      .then(function(users) {
        return users;
      });
  }

  getParticipantsOfCarpool(carpool: CarpoolModel): Promise<UserModel[]> {
    return this.carpoolService.getCarpoolParticipants(carpool.carpoolId)
      .then(function(users) {
        return users;
      });
  }

  async onCarpoolDetailClicked(carpool: CarpoolModel): Promise<void> {
    this.isCarpoolDetailVisible = true;
    this.visibleCarpool = carpool;
    this.carpoolParticipants = await this.getParticipantsOfCarpool(carpool);
  }

  async onEventDetailClicked(event: EventModel): Promise<void> {
    this.isEventDetailVisible = true;
    this.visibleEvent = event;
    this.eventParticipants = await this.getParticipantsOfEvent(event);
    this.eventCarpools = await this.getCarpoolsOfEvent(event);
    this.eventPictures = [];
    this.eventPictures = await this.getPicturesOfEvent(event);
  }

  getCarpoolsOfEvent(event: EventModel): Promise<CarpoolModel[]> {
    return this.carpoolService.getCarpoolsEvent(event.eventId)
      .then(function(carpools) {
        return carpools;
      });
  }

  getPicturesOfEvent(event: EventModel): Promise<MediaModel[]> {
    return this.zoneService.getPicturesZone(event.zone.zoneId)
      .then(function(pictures) {
        return pictures;
      });
  }

}
