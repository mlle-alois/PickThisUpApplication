import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticatedUserService} from "../../services/authenticated-user.service";
import {EventModel} from "../../models/event.model";
import {EventService} from "../../services/event.service";
import {DateUtils} from "../../utils/DateUtils";
import {MyDate} from "../../utils/MyDate";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  token: string;

  events: EventModel[] = [];
  currentTimestamp: MyDate;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticatedUserService: AuthenticatedUserService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.initToken();
  }

  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
    if (this.token === undefined) {
      window.location.reload();
    }
    this.events = await this.eventService.getAvailableEvents();
    this.currentTimestamp = DateUtils.getCurrentDate();
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }
}
