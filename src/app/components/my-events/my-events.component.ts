import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserModel} from '../../models/user.model';
import {EventModel} from '../../models/event.model';
import {MyDate} from '../../utils/MyDate';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticatedUserService} from '../../services/authenticated-user.service';
import {EventService} from '../../services/event.service';
import {DateUtils} from '../../utils/DateUtils';
import {status} from '../../enum/status';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit, AfterViewInit {

  token: string;
  currentUser: UserModel;

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

  isLoadedData: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticatedUserService: AuthenticatedUserService,
              private eventService: EventService) {
  }

  async ngOnInit() {
    this.initToken();
    await this.initCurrentUser();
    await this.initEvents();
    this.currentTimestamp = DateUtils.getCurrentDate();
    this.isLoadedData = true;
  }

  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
  }

  async initEvents() {
    this.pastEvents = await this.eventService.getPastEventsFromUser();
    this.futureEvents = await this.eventService.getFuturEventsFromUser();
    this.currentEvents = await this.eventService.getCurrentEventsFromUser();

    this.pastEventsValidated = this.pastEvents.filter((event) => event.statusId === status.validated);
    this.currentEventsValidated = this.currentEvents.filter((event) => event.statusId === status.validated);
    this.futureEventsValidated = this.futureEvents.filter((event) => event.statusId === status.validated);

    this.pastEventsWaiting = this.pastEvents.filter((event) => event.statusId === status.waiting);
    this.currentEventsWaiting = this.currentEvents.filter((event) => event.statusId === status.waiting);
    this.futureEventsWaiting = this.futureEvents.filter((event) => event.statusId === status.waiting);

    this.pastEventsRefused = this.pastEvents.filter((event) => event.statusId === status.refused);
    this.currentEventsRefused = this.currentEvents.filter((event) => event.statusId === status.refused);
    this.futureEventsRefused = this.futureEvents.filter((event) => event.statusId === status.refused);
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }

  async initCurrentUser() {
    this.currentUser = await this.authenticatedUserService.getCurrentUser();
  }

}
